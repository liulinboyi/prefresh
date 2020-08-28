const { transformSync } = require('@babel/core');

/** @returns {import('vite').Plugin} */
module.exports = function prefreshPlugin() {
	return {
		transforms: [
			{
				test: ({ path }) => /\.(t|j)s(x)?$/.test(path),
				transform({ code, isBuild, path }) {
					if (
						isBuild ||
						process.env.NODE_ENV === 'production' ||
						path.includes('node_modules') ||
						path.includes('@modules')
					)
						return code;

					const result = transform(code, path);

					if (!/\$RefreshReg\$\(/.test(result.code)) {
						return code;
					}

					let results = {
						code: `
            ${'import'} '/@modules/@prefresh/vite-fre/runtime/index';
            ${'import'} { compareSignatures } from '/@modules/@prefresh/vite-fre/utils/index';

            let prevRefreshReg;
            let prevRefreshSig;
            const module = {};

            if (import.meta.hot) {
              prevRefreshReg = self.$RefreshReg$ || (() => {});
              prevRefreshSig = self.$RefreshSig$ || (() => {});

              self.$RefreshReg$ = (type, id) => {
                module[type.name] = type;
              }

              self.$RefreshSig$ = () => {
                let status = 'begin';
                let savedType;
                return (type, key, forceReset, getCustomHooks) => {
                  if (!savedType) savedType = type;
                  // console.log(self, self.__PREFRESH__)
                  // status = self.__PREFRESH__ && self.__PREFRESH__.sign(type || savedType, key, forceReset, getCustomHooks, status);
                  return type;
                };
              };
            }

            ${result.code}

            if (import.meta.hot) {
              self.$RefreshReg$ = prevRefreshReg;
              self.$RefreshSig$ = prevRefreshSig;
              import.meta.hot.accept((m) => {
                try {
                  console.log(m, 'm')
                  for (let i in m) {
                    if (i === 'default') {
                      const keyword = m[i].name;
                      compareSignatures(module[keyword], m[i]);
                    } else {
                      compareSignatures(module[i], m[i]);
                    }
                  }
                  self.location.reload();
                } catch (e) {
                  self.location.reload();
                }
              });
            }
          `,
						map: result.map
					};
					// console.log(results, 'results');
					return results;
				}
			}
		]
	};
};

const transform = (code, path) => {
	// console.log(path, 'path')
	return transformSync(code, {
		plugins: [require('react-refresh/babel')],
		ast: false,
		sourceMaps: true,
		sourceFileName: path
	});
};
