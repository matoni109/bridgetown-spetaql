Object.defineProperty(exports, '__esModule', { value: true });
exports.default = void 0;
const groupStore =
{
  Channel: ["Channel", "ChannelCreateInput", "ChannelCreatePayload", "accessTokenAuthenticate", "channel"]
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
const _sortBy = _interopRequireDefault(require('lodash/sortBy'));
const _get = _interopRequireDefault(require('lodash/get'));
const { groupBy, sortBy } = require('lodash')
const { Microfiber: IntrospectionManipulator } = require('microfiber');


function sortByName(a, b) {
  if (a.name > b.name) {
    return 1;
  }
  if (a.name < b.name) {
    return -1;
  }

  return 0;
}

module.exports = ({
  // The Introspection Query Response after all the augmentation and metadata directives
  // have been applied to it
  introspectionResponse,
  // All the options that are specifically for the introspection related behaviors, such a this area.
  introspectionOptions,
  // A GraphQLSchema instance that was constructed from the provided introspectionResponse
  graphQLSchema: _graphQLSchema,
  // All of the SpectaQL options in case you need them for something.
  allOptions: _allOptions,
}) => {
  const introspectionManipulator = new IntrospectionManipulator(
    introspectionResponse,
    // microfiberOptions come from converting some of the introspection options to a corresponding
    // option for microfiber via the `src/index.js:introspectionOptionsToMicrofiberOptions()` function
    introspectionOptions?.microfiberOptions
  );

  const queryType = introspectionManipulator.getQueryType();
  const mutationType = introspectionManipulator.getMutationType()
  const normalTypes = introspectionManipulator.getAllTypes({
    includeQuery: false,
    includeMutation: false,
    includeSubscription: false,
  });

  const groupedOtherTypes = groupBy(normalTypes, (thing) => {
    return thing.kind
  })
  const groupedObjects = groupedOtherTypes.OBJECT
  const enumTypes = groupedOtherTypes.ENUM
  const scalarTypes = groupedOtherTypes.SCALAR
  // delete groupedOtherTypes.OBJECT;
  delete groupedOtherTypes.INPUT_OBJECT;

  const hasQueryKind = (queryKind, key) => {
    if (queryKind.fields) {
      return queryKind.fields.map(query => (query.name)).some(r => groupStore[key].includes(r))
    } else {
      return queryKind.map(query => (query.name)).some(r => groupStore[key].includes(r))
    }
  }

  // console.log("hasQueries:\n", hasQueries)
  // console.info("groupedObjects:\n", groupedObjects)
  // console.info("Normal Types:\n", normalTypes)
  // console.info("Query Types:\n", queryType)
  const objectsArray = ["Connection", "Edge", "PageInfo", "UserError"]

  return [
    {
      name: 'GraphQl API',
      hideInNav: false,
      hideInContent: true,
      makeNavSection: false,
      makeContentSection: false,
      items: Object.entries(groupStore)
        .map(([keyType, typeArray]) => {
          return {
            hideInNav: false,
            hideInContent: false,
            makeNavSection: true,
            makeContentSection: true,
            name: keyType, // groupStore Keys
            items: [
              // Queries
              hasQueryKind(queryType, keyType) ?
                {
                  name: 'Queries',
                  makeNavSection: true,
                  makeContentSection: true,
                  items: (0, _sortBy.default)(queryType.fields
                    .map((query) => ({
                      ...query,
                      isQuery: true,
                    }))
                    .filter(type => {
                      if (type.name) {
                        return typeArray.includes(type.name)
                      }
                    }),
                    'name'),
                } : null,
              // Mutations
              hasQueryKind(mutationType, keyType) ?
                {
                  name: 'Mutations',
                  makeNavSection: true,
                  makeContentSection: true,
                  items: (0, _sortBy.default)(
                    mutationType.fields.map((query) => ({
                      ...query,
                      isMutation: true,
                    })).filter(type => typeArray.includes(type.name)),
                    'name'
                  ),
                } : null,
              // normal Types
              hasQueryKind(normalTypes, keyType) ?
                {
                  name: 'Objects',
                  makeContentSection: true,
                  makeNavSection: true,
                  items: (0, _sortBy.default)(
                    normalTypes.map((type) => ({
                      ...type,
                      isType: true,
                    })).filter(type => typeArray.includes(type.name)),
                    'name'
                  ),
                } : null]
          }
        }
        )
    },
    //
    //  *** Graph Ql Types *** /
    //
    {
      name: 'GraphQl Types',
      hideInNav: false,
      hideInContent: true,
      makeNavSection: false,
      makeContentSection: false,
      items: [
        // Enums
        {
          name: 'Enums',
          makeNavSection: true,
          makeContentSection: true,
          items: (0, _sortBy.default)(enumTypes
            .map((en) => ({
              ...en,
              isType: true,
            }))
            ,
            'name'),
        },
        // Scalar
        {
          name: 'Scalar',
          makeNavSection: true,
          makeContentSection: true,
          items: (0, _sortBy.default)(scalarTypes
            .map((scalar) => ({
              ...scalar,
              isType: true,
            }))
            ,
            'name'),
        },
        // misc connectors etc
        {
          name: 'Objects',
          makeNavSection: true,
          makeContentSection: true,
          items: (0, _sortBy.default)(groupedObjects
            .map((obj) => ({
              ...obj,
              isType: true,
            }))
            .filter(type => {
              // objectsArray = ["Connection", "Edge", "PageInfo", "UserError"]
              if (objectsArray.some(r => type.name.split(/(?=[A-Z])/).includes(r)) || (objectsArray.includes(type.name))) {
                return true
              }
            }),
            'name'),
        }
      ]
    },
  ].filter(Boolean);

};



