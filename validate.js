import fs from "fs"
import path from "path"
import markdownlint from "markdownlint"
import { config } from "./.markdownlint-config.js"
import colors from "colors"

function init() {
  const markdownFilePaths = getMarkdownFilePaths(".")
  const problems = findProblems(markdownFilePaths)
  render(markdownFilePaths, problems)
}

function getMarkdownFilePaths(directory) {
  const ignoreList = [
    ".git",
    "_layouts",
    "assets",
    "node_modules",
  ]
  const dirContents = fs.readdirSync(directory)
  const markdownFilePaths = []

  for (const item of dirContents) {
    if (ignoreList.includes(item)) continue

    const itemPath = `${directory}/${item}`

    if (fs.statSync(itemPath).isDirectory()) {
      const filePaths = getMarkdownFilePaths(itemPath)
      filePaths.forEach(filePath => markdownFilePaths.push(filePath))
    } else {
      const { ext } = path.parse(itemPath)
      if (ext === ".md") {
        markdownFilePaths.push(itemPath)
      }
    }
  }
  return markdownFilePaths
}

function findProblems(markdownFilePaths) {
  const options = {
    files: markdownFilePaths,
    config: config,
  }
  
  return markdownlint.sync(options)
}

function render(markdownFilePaths, problems) {
  markdownFilePaths.forEach(file => {
    const issues = problems[file]
    issues.sort((firstIssue, secondIssue) => {
      return firstIssue.lineNumber - secondIssue.lineNumber
    })
    issues.length ? logFileProblem(file, issues) : logFileSuccess(file)
  })

  const isProblemFound = markdownFilePaths.some(file => problems[file].length)

  if (isProblemFound) {
    console.log(colors.red(`🛑 Some Markdown formatting problems were found and should be resolved. See the notes above for details.`))
  } else {
    console.log(colors.green(`🥳 No problems were found. Congrats!`))
  }
}

function logFileSuccess(file) {
  console.log(colors.white(`🚀 ${file}`), colors.green(`has no issues!`));
}

function logFileProblem(file, issues) {
  console.log(colors.white(`❌ ${file}`), colors.red(`has these issues:`))
  console.log()
  issues.forEach(issue => {
    console.log(`   Line: ${colors.yellow(`${issue.lineNumber}`)}`)
    console.log(`     Issue ID: ${colors.yellow(`${issue.ruleNames[0]}`)}`)
    console.log(
      `     Details: ${issue.ruleDescription}`, 
      issue.errorDetail ? `- ${issue.errorDetail}` : ""
    )
    console.log()
  })
}

init()