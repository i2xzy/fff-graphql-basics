const addCladeResolver = async (_, { id, data }) => {
  console.log('addClade');
  console.log({ id, data });

  return { success: true };
};

export default addCladeResolver;
