async function getAllItems(reference) {
  const snap = await reference.once("value");
  const arrayOfObjects = await snap.val();
  if (arrayOfObjects === null) return [];
  return Object.keys(arrayOfObjects).map(o => Object.assign({ id: o }, arrayOfObjects[o]));
}

const Query = {
  Query: {
    hello: (_, { name }, ctx, info) => {
      console.log("userId", ctx.request.userId);
      return `Hello ${name || "World"}`;
    },
    courses: (parent, args, ctx, info) => getAllItems(ctx.db.ref("courses")),
    gebruikers: async (parent, args, ctx, info) => getAllItems(ctx.db.ref("gebruikers")),
    me: async (parent, args, { auth }, info) => {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("you must be signed in");
      } else {
        const { uid: id, email, password, displayName: name, photoURL } = user;
        return {
          id,
          email,
          password,
          name,
          photoURL
        };
      }
    }
  },
  Course: {
    takenby: async (parent, args, ctx, info) => {
      console.log("takenby for " + parent.id);
      const allUsers = await ctx.db.ref(`courses/${parent.id}/takenby`).once("value");
      const arrayOfObjects = await allUsers.val();
      if (arrayOfObjects === null) return [];
      return Object.keys(arrayOfObjects).map(o => arrayOfObjects[o]);
    }
  }
};

const Other = {
  Course: {
    takenby: async (parent, args, ctx, info) => {
      console.log("takenby");
    }
  }
};

module.exports = Query;
