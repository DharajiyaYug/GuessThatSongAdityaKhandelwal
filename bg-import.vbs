Set sh = CreateObject("WScript.Shell")
sh.CurrentDirectory = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
' Runs the song importer with no window. Progress: data\bg-status.json  Stop: end "Node.js JavaScript Runtime" in Task Manager.
sh.Run "cmd /c node bg-import.js >> data\bg-console.log 2>&1", 0, False
