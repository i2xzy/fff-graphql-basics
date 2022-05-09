const deleteCladeResolver = async (_, { id }) => {
  console.log('deleteClade');
  console.log({ id });

  return { success: true };
};

export default deleteCladeResolver;
