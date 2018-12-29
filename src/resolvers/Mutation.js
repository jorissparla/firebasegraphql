const Mutation = {
  createCourse: async (parent, { title }, ctx, info) => {
    const { key: id } = await coursesRef.push({ title });
    return { id, title };
  },
  createGebruiker: async (parent, { input }, ctx, info) => {
    const { key: id } = await gebruikersRef.push(input);
    return { id, ...input };
  }
};

module.exports = Mutation;
