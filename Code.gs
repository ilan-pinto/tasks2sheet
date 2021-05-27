var taskListTitle = "User's list";
var spreadsheetId = "1AKd7GhKENiDPy7EkNwXBUW2tkE3JJqAvP-OGuZ80Y1E";
var sheetName = "Sheet1";

function run() {
  var taskListId = getTaskListId(taskListTitle);
  if (!taskListId) {
    console.log('Did not find a task list with the title of %s', taskListTitle);
    return;
  }

  var tasks = getTasks(taskListId);
  console.log("Found %s tasks", tasks.length);

  var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  var rowCount = sheet.getLastRow();
  console.log("Found %s rows in the sheet called %s", sheet.getLastRow(), sheetName);

  for (taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
    var task = tasks[taskIndex];
    var rowIndex = findTask(sheet, task.id);
    if (!rowIndex) {
      rowIndex = rowCount + 1;
      console.log("Task %s not found in the spreadsheet; will add at row %s", task.title, rowIndex);
      rowCount++;
    } else {
      console.log("Found task %s in row %s, will update with retrieved content", task.title, rowIndex);
    }
    setSheetRow(sheet, rowIndex, task);
  }

}

function getTaskListId(taskListName) {
  var taskLists = Tasks.Tasklists.list().getItems();
  if (!taskLists) {
    return null;
  }
  for (i = 0; i < taskLists.length; i++) {
    taskList = taskLists[i];
    // console.log('Found task list called %s with id %s', taskList.title, taskList.id);
    if (taskList.title === taskListName ) {
      return taskList.id;
    }
  }
}

function getTasks(listId) {
  var params = {
    showHidden: true,
    showCompleted: true
  };
  var tasks = Tasks.Tasks.list(listId, params).getItems();
  if (!tasks) {
    return [];
  }
  return tasks;
}

function findTask(sheet, taskId) {
  var array = sheet.getSheetValues(1, 1, sheet.getLastRow(), 1);
  for (index = 0; index < sheet.getLastRow(); index++) {
    if (array[index][0] == taskId) {
      return index + 1;
    }
  }
}

function setSheetRow(sheet, row, task) {
  sheet.getRange(row,1,1,1).setValue(task.id);
  sheet.getRange(row,2,1,1).setValue(task.title);
  sheet.getRange(row,3,1,1).setValue(task.notes);
  if (!task.due) {
    sheet.getRange(row,4,1,1).clear();
  } else {
    sheet.getRange(row,4,1,1).setValue(formatDate(task.due));
  }
  if (!task.completed) {
    sheet.getRange(row,5,1,1).clear();
  } else {
    sheet.getRange(row,5,1,1).setValue(formatDate(task.completed));
  }
}

function formatDate(date) {
  date = new Date(date);
  return Utilities.formatDate(date, 'UTC', 'MM/dd/yyyy HH:mm:ss');
}
