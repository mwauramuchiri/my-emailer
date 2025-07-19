module.exports = {
	"env": {
		"browser": true,
		"commonjs": true,
		"es6": true
  },
  "plugins": [
    "prettier",
    "node"
  ],
	"extends": [
    "eslint:recommended",
    "plugin:prettier/recommended",
	  "plugin:node/recommended"
	],
	"globals": {
		"Atomics": "readonly",
		"SharedArrayBuffer": "readonly"
	},
	"parserOptions": {
		"ecmaVersion": 2018
	},
	// "rules": {
	// 	"indent": [
	// 		"error",
	// 		2
	// 	],
	// 	"linebreak-style": [
	// 		"error",
	// 		"windows"
	// 	],
	// 	"quotes": [
	// 		"error",
	// 		"double"
	// 	],
	// 	"semi": [
	// 		"error",
	// 		"always"
  //   ],
  //   "camelcase": [
  //     "error",
  //     {
  //       "properties": "always"
  //     }
  //   ],
  //   "no-multiple-empty-lines": [
  //     "error", 
  //     {
  //     "max": 1
  //     }
  //   ],
  //   "no-unused-vars": [
	// 		"error",
	// 		{
	// 			"varsIgnorePattern": "^_",
	// 			"argsIgnorePattern": "^_"
	// 		}
	// 	]
	// }
};