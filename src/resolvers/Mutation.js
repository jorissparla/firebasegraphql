const jwt = require("jsonwebtoken");
const { format } = require("date-fns");
const Mutation = {
  createCourse: async (parent, { input }, ctx, info) => {
    const date = format(input.date, "YYYY-MM-DD");
    const coursesRef = ctx.db.ref("courses");
    const { key: id } = await coursesRef.push({ title: input.title, date });
    return { id, title: input.title, date: format(date, "YYYY-MM-DD") };
  },
  subscribetoCourse: async (parent, { courseId }, ctx, info) => {
    const currentUserId = ctx.request.userId;
    if (!currentUserId) {
      throw new Error("You must be logged in to subscribe");
    }
    const courseRef = await ctx.db.ref("/courses/" + courseId).once("value");
    const val = await courseRef.val();
    if (!val) {
      throw new Error("Invalid course");
    }
    const { uid: id, email, displayName: name, photoURL } = ctx.auth.currentUser;
    const user = { id, email, name, photoURL };
    console.log(user);
    await ctx.db.ref("/courses/" + courseId + "/takenby/" + currentUserId).set(user);
    const course = { id: courseId, ...courseRef.val() };
    return course;
  },
  createGebruiker: async (parent, { input }, ctx, info) => {
    const { key: id } = await gebruikersRef.push(input);
    return { id, ...input };
  },
  signin: async (parent, { email, password }, ctx, info) => {
    await ctx.auth.signInWithEmailAndPassword(email, password);
    //const response = await ctx.auth.currentUser();
    console.log(ctx.auth.currentUser.uid);
    const user = ctx.auth.currentUser;
    if (!user) {
      throw new Error("invalid email/password");
    }
    const token = jwt.sign({ userId: user.uid }, process.env.APPSECRET);
    console.log(token);
    ctx.response.cookie("token", token, {
      httpOnly: false,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });
    const newUser = { id: user.uid, email, password, name: user.displayName, photoURL: user.photoURL };
    return newUser;
  },
  signout: async (parent, args, ctx, info) => {
    await ctx.auth.signOut();
    ctx.response.clearCookie("token");
    return { message: "Goodbye" };
  },
  signup: async (parent, { email, password, name: displayName, photoURL = "" }, { auth }, info) => {
    await auth.createUserWithEmailAndPassword(email, password);
    const user = auth.currentUser;
    if (!user) {
      throw new Error("invalid signup credentials");
    }
    await user.updateProfile({
      displayName,
      photoURL
    });
    return { id: user.uid, email, password, name: user.displayName, photoURL: user.photoURL };
  },
  requestReset: async (parent, { email }, { auth }, info) => {
    await auth.sendPasswordResetEmail(email);
    return { message: "Goodbye" };
  },
  updateProfile: async (parent, { input }, { auth }, info) => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("You must be signed in");
    }
    await user.updateProfile({ displayName: input.name, photoURL: input.photoURL });
    return {
      id: user.uid,
      email: user.email,
      password: user.password,
      name: user.displayName,
      photoURL: user.photoURL
    };
  }
};

module.exports = Mutation;
