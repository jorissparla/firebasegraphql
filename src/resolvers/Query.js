async function getAllItems(reference) {
  const snap = await reference.once("value");
  const arrayOfObjects = await snap.val();
  if (arrayOfObjects === null) return [];
  return Object.keys(arrayOfObjects).map(o => Object.assign({ id: o }, arrayOfObjects[o]));
}

const Query = {
  hello: (_, { name }) => `Hello ${name || "World"}`,
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
};

module.exports = Query;
