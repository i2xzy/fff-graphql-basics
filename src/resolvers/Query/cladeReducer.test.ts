import cladeReducer from './cladeReducer';

describe('cladeReducer', () => {
  it('no children', () => {
    const node = [
      {
        id: { value: '81461' },
        name: { value: 'Aves' },
        parentId: { value: '664351' },
        source: { value: 'irmng:1142' },
        children: undefined,
        hasChildren: { value: 'false' },
        isFlying: { value: 'true' },
        rank: { value: 'class' },
      },
    ];

    const result = {
      id: '81461',
      name: 'Aves',
      children: [],
      attributes: {
        id: '81461',
        hasChildren: false,
        parentId: '664351',
        characteristics: [{ name: 'isFlying', value: true }],
        rank: 'class',
        source: ['irmng:1142'],
      },
    };

    return expect(cladeReducer(node, async () => node)).resolves.toStrictEqual(
      result
    );
  });

  it('1 child', () => {
    const node = [
      {
        id: { value: '81461' },
        name: { value: 'Aves' },
        parentId: { value: '664351' },
        source: { value: 'irmng:1142' },
        children: { value: '3601096' },
        hasChildren: { value: 'true' },
        isFlying: { value: 'true' },
        rank: { value: 'class' },
      },
    ];

    const result = {
      id: '81461',
      name: 'Aves',
      attributes: {
        id: '81461',
        hasChildren: true,
        parentId: '664351',
        characteristics: [{ name: 'isFlying', value: true }],
        rank: 'class',
        source: ['irmng:1142'],
      },
      children: [
        {
          id: '3601096',
          name: 'Neognathes',
          attributes: {
            id: '3601096',
            hasChildren: false,
            parentId: '81461',
            characteristics: [{ name: 'isFlying', value: true }],
            rank: undefined,
            source: [],
          },
          children: [],
        },
      ],
    };

    const getNode = async () => [
      {
        id: { value: '3601096' },
        name: { value: 'Neognathes' },
        parentId: { value: '81461' },
        source: undefined,
        children: undefined,
        hasChildren: { value: 'false' },
        isFlying: { value: 'true' },
      },
    ];

    return expect(cladeReducer(node, getNode)).resolves.toStrictEqual(result);
  });

  it('2 children', () => {
    const node = [
      {
        id: { value: '81461' },
        name: { value: 'Aves' },
        parentId: { value: '664351' },
        source: { value: 'irmng:1142' },
        children: { value: '3601096' },
        hasChildren: { value: 'true' },
        isFlying: { value: 'true' },
      },
      {
        id: { value: '81461' },
        name: { value: 'Aves' },
        parentId: { value: '664351' },
        source: { value: 'irmng:1142' },
        children: { value: '3601097' },
        hasChildren: { value: 'true' },
        isFlying: { value: 'true' },
      },
    ];

    const result = {
      id: '81461',
      name: 'Aves',
      attributes: {
        id: '81461',
        hasChildren: true,
        parentId: '664351',
        characteristics: [{ name: 'isFlying', value: true }],
        rank: undefined,
        source: ['irmng:1142'],
      },
      children: [
        {
          id: '3601096',
          name: 'Neognathes',
          attributes: {
            id: '3601096',
            hasChildren: false,
            parentId: '81461',
            characteristics: [{ name: 'isFlying', value: true }],
            rank: undefined,
            source: [],
          },
          children: [],
        },
        {
          id: '3601097',
          name: 'Paeleognathes',
          attributes: {
            id: '3601097',
            hasChildren: false,
            parentId: '81461',
            characteristics: [{ name: 'isFlying', value: true }],
            rank: undefined,
            source: [],
          },
          children: [],
        },
      ],
    };

    const getNode = async id => [
      {
        id: { value: id },
        name: { value: id === '3601096' ? 'Neognathes' : 'Paeleognathes' },
        parentId: { value: '81461' },
        source: undefined,
        children: undefined,
        hasChildren: { value: 'false' },
        isFlying: { value: 'true' },
      },
    ];

    return expect(cladeReducer(node, getNode)).resolves.toStrictEqual(result);
  });

  it('only return 1 generation', () => {
    const node = [
      {
        id: { value: '81461' },
        name: { value: 'Aves' },
        parentId: { value: '664351' },
        source: { value: 'irmng:1142' },
        children: { value: '3601096' },
        hasChildren: { value: 'true' },
        isFlying: { value: 'true' },
      },
      {
        id: { value: '81461' },
        name: { value: 'Aves' },
        parentId: { value: '664351' },
        source: { value: 'irmng:1142' },
        children: { value: '3601097' },
        hasChildren: { value: 'true' },
        isFlying: { value: 'true' },
      },
    ];

    const result = {
      id: '81461',
      name: 'Aves',
      attributes: {
        id: '81461',
        hasChildren: true,
        parentId: '664351',
        characteristics: [{ name: 'isFlying', value: true }],
        rank: undefined,
        source: ['irmng:1142'],
      },
      children: [],
    };

    const getNode = async id => [
      {
        id: { value: id },
        name: { value: id === '3601096' ? 'Neognathes' : 'Paeleognathes' },
        parentId: { value: '81461' },
        source: undefined,
        children: undefined,
        hasChildren: { value: 'false' },
        isFlying: { value: 'true' },
      },
    ];

    return expect(cladeReducer(node, getNode, 1)).resolves.toStrictEqual(
      result
    );
  });
});
