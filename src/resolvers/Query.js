async function getAllItems(reference) {
  const snap = await reference.once("value");
  const arrayOfObjects = await snap.val();
  if (arrayOfObjects === null) return [];
  return Object.keys(arrayOfObjects).map(o => Object.assign({ id: o }, arrayOfObjects[o]));
}

const Query = {
  hello: (_, { name }) => `Hello ${name || "World"}`,
  courses: (parent, args, ctx, info) => getAllItems(ctx.db.ref("courses")),
  gebruikers: async (parent, args, ctx, info) => getAllItems(ctx.db.ref("gebruikers"))
};

module.exports = Query;
