#!/usr/bin/env node

import { join } from "node:path"
import { existsSync } from "node:fs"
import { readFile, writeFile } from "node:fs/promises"
import { execSync } from "node:child_process"
import { cwd } from "node:process"

class Repo {
  constructor(conf={}) {
    this.conf = {
      dir: cwd(),
      ...conf
    }
    this.dir = this.conf.dir
    this.readmeTxtPath = this.join("README")
    this.readmeMdPath = this.join("README.md")
    this.packagePath = this.join("package.json")
    this.seriesPath = this.join("series.json")
    this.gitPath = this.join(".git")
    if (!existsSync(this.packagePath)) {
      throw new Error("package.json missing")
    }
    this.hasGit = existsSync(this.gitPath)
    this.hasSeries = existsSync(this.seriesPath)
    this.hasSeriesName = this.hasGit && this.hasSeries
    this.hasReadme = true
    this.hasMd = false
    if (existsSync(this.readmeMdPath)) {
      this.hasMd = true
      this.readmePath = this.readmeMdPath
    } else if (existsSync(this.readmeTxtPath)) {
      this.readmePath = this.readmeTxtPath
    } else {
      this.hasReadme = false
    }
    this.series = []
    this.seriesName = ""
  }
  get pSeriesName() {
    return this.seriesName ? ` '${this.seriesName}'` : ""
  }
  get pName() { return `**${this.name}**` }
  get pBefore() { return this.before ? `${this.before} ` : "" }
  get pAfter() { return this.after ? ` ${this.after}` : "" }

  async update(ver) {
    console.log(`updating to ${ver}`)

    this.pkg = JSON.parse(await readFile(this.packagePath))
    const rc = this.pkg.mkv || {}
    this.conf = {
      ...this.conf,
      ...rc,
    }
    this.pkg.version = ver.slice(1)

    this.name = this.conf.name || this.pkg.name
    this.before = this.conf.before || ""
    this.after = this.conf.after || ""

    if (this.hasSeriesName) {
      this.series = JSON.parse(await readFile(this.seriesPath))
      this.vinfo = execSync(`git --git-dir="${this.gitPath}" tag -l "v*"`, {
        encoding: 'utf-8'
      })
      let vers = [...this.vinfo.split("\n").filter(v=> !!v), ver]
      vers = [...new Set(vers.map(v=> v.split('.').slice(0,-1).join('.')))]
      this.seriesName = this.series[vers.length-1].toUpperCase()
      this.pkg.series = this.seriesName
      console.log(`series name: ${this.seriesName}`)
    }

    if (this.hasReadme) {
      const code = `${ver}${this.pSeriesName}`
      const head = this.hasMd ? "# " : ""
      const line = `${head}${this.pBefore}${this.pName}${this.pAfter} ${code}`
      let readme = await readFile(this.readmePath, {encoding: 'UTF-8'})
      readme = readme.split('\n').slice(1)
      readme = [line, ...readme]
      await writeFile(this.readmePath, readme.join('\n'))
      console.log(`updated README.md`)
    }

    await writeFile(this.packagePath, JSON.stringify(this.pkg, null, 2))
    console.log(`updated package.json`)

    console.log(`remember to \`git tag ${ver}\` after committing`)
  }
  join(...parts) {
    return join(this.dir, ...parts)
  }
}

const ver = process.argv[2]
if (!ver || !ver.match(/^v\d+\.\d+\.\d+$/)) {
  console.log(`ERROR: '${ver}' is not a valid version`)
  process.exit(1)
}
const repo = new Repo()
await repo.update(ver)
