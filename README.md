# 🔨 **mkv** versioning helper v0.1.1 'GAFFGARION'
[![Version][icon-ver]][repo]
[![License][icon-lic]][license]
[![Maintenance][icon-mnt]][commits]<br/>
[![npm][icon-npm]][npm]

**mkv** is a small tool I use in my projects. It updates the project's version number in `package.json` and on the first line of your README. It will also select a series name and update both locations wth that. Config goes in your `package.json`:

```json
{
  "name": "@0e9b061f/mkv",
  "mkv": {
    "name": "mkv",
    "before": "🔨",
    "after": "versioning helper"
  }
}
```

If the name you want to have set in your README is different from the package name, set the name you want in `mkv.name`. You may also configure text to be shown before and after the name.

You can also give your project series names by creating `series.json`:

```json
[
  "Gaffgarion",
  "T.G. Cid",
  "Ultima",
  "Ramza",
  "Ajora",
  "Alma",
  "Agrias",
  "Ovelia",
  "Delita"
]
```

However, this relies on your project existing in a git repo and using version tags with a form like `v0.1.0`. A new series name is given every time you change the major or minor version of your project. Patch numbers are ignored.

# License

Copyright 2024 **[0E9B061F][gh]**<br/>
Available under the terms of the [MIT License][license].


[gh]:https://github.com/0E9B061F
[repo]:https://github.com/0E9B061F/mkv
[npm]:https://www.npmjs.com/package/@0e9b061f/mkv
[commits]:https://github.com/0E9B061F/mkv/commits/master
[license]:https://github.com/0E9B061F/mkv/blob/master/LICENSE

[icon-ver]:https://img.shields.io/github/package-json/v/0E9B061F/mkv.svg?style=flat-square&logo=github&color=%236e7fd2
[icon-npm]:https://img.shields.io/npm/v/@0e9b061f/mkv.svg?style=flat-square&color=%23de2657
[icon-lic]:https://img.shields.io/github/license/0E9B061F/mkv.svg?style=flat-square&color=%236e7fd2
[icon-mnt]:https://img.shields.io/maintenance/yes/2024.svg?style=flat-square