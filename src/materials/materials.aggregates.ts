export const SearchPipeline = (query: string) => [
  {
    $search: {
      index: 'default',
      compound: {
        should: [
          {
            text: {
              query: query,
              path: 'label',
              score: { boost: { value: 4 } },
              fuzzy: {
                maxEdits: 2, // Maximum allowed edit distance (0, 1, or 2)
              },
            },
          },
          {
            text: {
              query: query,
              path: 'tags',
              score: { boost: { value: 3 } },
            },
          },
          {
            text: {
              query: query,
              path: 'description',
              score: { boost: { value: 2 } },
            },
          },
          {
            text: {
              query: query,
              path: 'metaData.files',
              score: { boost: { value: 1 } },
            },
          },
        ],
        score: {
          function: {
            path: 'downloadCount',
          },
        },
      },
    },
  },
];

// export const SearchPipeline = (query: string) => [
//   {
//     $search: {
//       index: 'default',
//       compound: {
//         should: [
//           {
//             text: {
//               query: query,
//               path: 'label',
//               score: { boost: { value: 4 } },
//             },
//           },
//           {
//             text: {
//               query: query,
//               path: 'tags',
//               score: { boost: { value: 3 } },
//             },
//           },
//           {
//             text: {
//               query: query,
//               path: 'description',
//               score: { boost: { value: 2 } },
//             },
//           },
//           {
//             text: {
//               query: query,
//               path: 'metaData.files',
//               score: { boost: { value: 1 } },
//             },
//           },
//         ],
//       },
//     },
//   },
// ];
