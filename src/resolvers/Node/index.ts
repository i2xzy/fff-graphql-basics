export default {
  attributes: node => ({
    ...node.attributes,
    id: node.id,
  }),
};
