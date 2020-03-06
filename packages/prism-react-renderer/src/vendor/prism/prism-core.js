/* eslint-disable */
/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

/**
 * prism-react-renderer:
 * This file has been modified to remove:
 * - globals and window dependency
 * - worker support
 * - highlightAll and other element dependent methods
 * - _.hooks helpers
 * - UMD/node-specific hacks
 * It has also been run through prettier
 */
const Prism = (function() {
  // Private helper vars
  // const lang = /\blang(?:uage)?-([\w-]+)\b/i;
  let uniqueId = 0;

  const _ = {
    util: {
      encode(tokens) {
        if (tokens instanceof Token) {
          return new Token(
            tokens.type,
            _.util.encode(tokens.content),
            tokens.alias,
          );
        }
        if (_.util.type(tokens) === 'Array') {
          return tokens.map(_.util.encode);
        }
        return tokens
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/\u00a0/g, ' ');
      },

      type(o) {
        return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
      },

      objId(obj) {
        if (!obj.__id) {
          Object.defineProperty(obj, '__id', { value: ++uniqueId });
        }
        return obj.__id;
      },

      // Deep clone a language definition (e.g. to extend it)
      clone(o, visited) {
        const type = _.util.type(o);
        visited = visited || {};

        switch (type) {
          case 'Object':
            if (visited[_.util.objId(o)]) {
              return visited[_.util.objId(o)];
            }

            var clone = {};
            visited[_.util.objId(o)] = clone;

            for (const key in o) {
              if (o.hasOwnProperty(key)) {
                clone[key] = _.util.clone(o[key], visited);
              }
            }

            return clone;

          case 'Array':
            if (visited[_.util.objId(o)]) {
              return visited[_.util.objId(o)];
            }

            var clone = [];
            visited[_.util.objId(o)] = clone;
            o.forEach(function(v, i) {
              clone[i] = _.util.clone(v, visited);
            });
            return clone;
        }

        return o;
      },
    },

    languages: {
      extend(id, redef) {
        const lang = _.util.clone(_.languages[id]);

        for (const key in redef) {
          lang[key] = redef[key];
        }

        return lang;
      },

      /**
       * Insert a token before another token in a language literal
       * As this needs to recreate the object (we cannot actually insert before keys in object literals),
       * we cannot just provide an object, we need anobject and a key.
       * @param inside The key (or language id) of the parent
       * @param before The key to insert before. If not provided, the function appends instead.
       * @param insert Object with the key/value pairs to insert
       * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
       */
      insertBefore(inside, before, insert, root) {
        root = root || _.languages;
        const grammar = root[inside];

        if (arguments.length == 2) {
          insert = arguments[1];

          for (var newToken in insert) {
            if (insert.hasOwnProperty(newToken)) {
              grammar[newToken] = insert[newToken];
            }
          }

          return grammar;
        }

        const ret = {};

        for (const token in grammar) {
          if (grammar.hasOwnProperty(token)) {
            if (token == before) {
              for (var newToken in insert) {
                if (insert.hasOwnProperty(newToken)) {
                  ret[newToken] = insert[newToken];
                }
              }
            }

            ret[token] = grammar[token];
          }
        }

        // Update references in other language definitions
        _.languages.DFS(_.languages, function(key, value) {
          if (value === root[inside] && key != inside) {
            this[key] = ret;
          }
        });

        return (root[inside] = ret);
      },

      // Traverse a language definition with Depth First Search
      DFS(o, callback, type, visited) {
        visited = visited || {};
        for (const i in o) {
          if (o.hasOwnProperty(i)) {
            callback.call(o, i, o[i], type || i);

            if (
              _.util.type(o[i]) === 'Object' &&
              !visited[_.util.objId(o[i])]
            ) {
              visited[_.util.objId(o[i])] = true;
              _.languages.DFS(o[i], callback, null, visited);
            } else if (
              _.util.type(o[i]) === 'Array' &&
              !visited[_.util.objId(o[i])]
            ) {
              visited[_.util.objId(o[i])] = true;
              _.languages.DFS(o[i], callback, i, visited);
            }
          }
        }
      },
    },

    plugins: {},

    highlight(text, grammar, language) {
      const env = {
        code: text,
        grammar,
        language,
      };
      _.hooks.run('before-tokenize', env);
      env.tokens = _.tokenize(env.code, env.grammar);
      _.hooks.run('after-tokenize', env);
      return Token.stringify(_.util.encode(env.tokens), env.language);
    },

    matchGrammar(text, strarr, grammar, index, startPos, oneshot, target) {
      const { Token } = _;

      for (const token in grammar) {
        if (!grammar.hasOwnProperty(token) || !grammar[token]) {
          continue;
        }

        if (token == target) {
          return;
        }

        let patterns = grammar[token];
        patterns = _.util.type(patterns) === 'Array' ? patterns : [patterns];

        for (let j = 0; j < patterns.length; ++j) {
          let pattern = patterns[j];
          const { inside } = pattern;
          const lookbehind = !!pattern.lookbehind;
          const greedy = !!pattern.greedy;
          let lookbehindLength = 0;
          const { alias } = pattern;

          if (greedy && !pattern.pattern.global) {
            // Without the global flag, lastIndex won't work
            const flags = pattern.pattern.toString().match(/[imuy]*$/)[0];
            pattern.pattern = RegExp(pattern.pattern.source, `${flags}g`);
          }

          pattern = pattern.pattern || pattern;

          // Don’t cache length as it changes during the loop
          for (
            let i = index, pos = startPos;
            i < strarr.length;
            pos += strarr[i].length, ++i
          ) {
            let str = strarr[i];

            if (strarr.length > text.length) {
              // Something went terribly wrong, ABORT, ABORT!
              return;
            }

            if (str instanceof Token) {
              continue;
            }

            if (greedy && i != strarr.length - 1) {
              pattern.lastIndex = pos;
              var match = pattern.exec(text);
              if (!match) {
                break;
              }

              var from = match.index + (lookbehind ? match[1].length : 0);
              var to = match.index + match[0].length;
              let k = i;
              let p = pos;

              for (
                let len = strarr.length;
                k < len &&
                (p < to || (!strarr[k].type && !strarr[k - 1].greedy));
                ++k
              ) {
                p += strarr[k].length;
                // Move the index i to the element in strarr that is closest to from
                if (from >= p) {
                  ++i;
                  pos = p;
                }
              }

              // If strarr[i] is a Token, then the match starts inside another Token, which is invalid
              if (strarr[i] instanceof Token) {
                continue;
              }

              // Number of tokens to delete and replace with the new match
              delNum = k - i;
              str = text.slice(pos, p);
              match.index -= pos;
            } else {
              pattern.lastIndex = 0;

              var match = pattern.exec(str);
              var delNum = 1;
            }

            if (!match) {
              if (oneshot) {
                break;
              }

              continue;
            }

            if (lookbehind) {
              lookbehindLength = match[1] ? match[1].length : 0;
            }

            var from = match.index + lookbehindLength;
            var match = match[0].slice(lookbehindLength);
            var to = from + match.length;
            const before = str.slice(0, from);
            const after = str.slice(to);

            const args = [i, delNum];

            if (before) {
              ++i;
              pos += before.length;
              args.push(before);
            }

            const wrapped = new Token(
              token,
              inside ? _.tokenize(match, inside) : match,
              alias,
              match,
              greedy,
            );

            args.push(wrapped);

            if (after) {
              args.push(after);
            }

            Array.prototype.splice.apply(strarr, args);

            if (delNum != 1)
              _.matchGrammar(text, strarr, grammar, i, pos, true, token);

            if (oneshot) break;
          }
        }
      }
    },

    hooks: {
      all: {},

      add(name, callback) {
        const hooks = _.hooks.all;
        hooks[name] = hooks[name] || [];
        hooks[name].push(callback);
      },

      run(name, env) {
        const callbacks = _.hooks.all[name];
        if (!callbacks) return;
        callbacks.forEach(callback => callback(env));
      },
    },

    tokenize(text, grammar, language) {
      const strarr = [text];

      const { rest } = grammar;

      if (rest) {
        for (const token in rest) {
          grammar[token] = rest[token];
        }

        delete grammar.rest;
      }

      _.matchGrammar(text, strarr, grammar, 0, 0, false);

      return strarr;
    },
  };

  var Token = (_.Token = function(type, content, alias, matchedStr, greedy) {
    this.type = type;
    this.content = content;
    this.alias = alias;
    // Copy of the full string this token was created from
    this.length = (matchedStr || '').length | 0;
    this.greedy = !!greedy;
  });

  Token.stringify = function stringify(o, language) {
    if (typeof o === 'string') {
      return o;
    }
    if (Array.isArray(o)) {
      let s = '';
      o.forEach(function(e) {
        s += stringify(e, language);
      });
      return s;
    }

    const env = {
      type: o.type,
      content: stringify(o.content, language),
      tag: 'span',
      classes: ['token', o.type],
      attributes: {},
      language,
    };

    const aliases = o.alias;
    if (aliases) {
      if (Array.isArray(aliases)) {
        Array.prototype.push.apply(env.classes, aliases);
      } else {
        env.classes.push(aliases);
      }
    }

    _.hooks.run('wrap', env);

    let attributes = '';
    for (const name in env.attributes) {
      attributes += ` ${name}="${(env.attributes[name] || '').replace(
        /"/g,
        '&quot;',
      )}"`;
    }

    return `<${env.tag} class="${env.classes.join(' ')}"${attributes}>${
      env.content
    }</${env.tag}>`;
  };

  return _;
})();

export default Prism;
