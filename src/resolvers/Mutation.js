const jwt = require("jsonwebtoken");

const Mutation = {
  createCourse: async (parent, { title }, ctx, info) => {
    const { key: id } = await coursesRef.push({ title });
    return { id, title };
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

    return { id: user.uid, email, password, name: user.displayName, photoURL: user.photoURL };
  },
  signout: async (parent, args, { auth }, info) => {
    await auth.signOut();
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
  }
};

module.exports = Mutation;
