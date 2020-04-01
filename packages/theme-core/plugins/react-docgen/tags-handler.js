const Doclets = require('./doclets');

function tagsHandler(documentation) {
  const description = documentation.get('description') || '';

  const tags = Doclets.parseTags(description);

  documentation.set('docblock', description);
  documentation.set('description', Doclets.cleanTags(description));

  documentation.set('tags', tags || []);

  // eslint-disable-next-line no-underscore-dangle
  documentation._props.forEach((_, name) => {
    const propDoc = documentation.getPropDescriptor(name);

    const propDescription = propDoc.description || '';
    const propTags = Doclets.parseTags(propDescription);

    propDoc.docblock = propDescription;
    propDoc.description = Doclets.cleanTags(propDescription);
    propDoc.tags = propTags || [];

    Doclets.applyPropTags(propDoc);
  });
}

module.exports = tagsHandler;
