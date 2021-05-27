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
  // console.log("Found %s rows in the sheet called %s", sheet.getLastRow(), sheetName);

  for (taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
    var task = tasks[taskIndex];
    var rowIndex = findTask(sheet, task.id);
    if (!rowIndex) {
      rowIndex = rowCount + 1;
      console.log("Task %s not found in the spreadsheet; will add at row %s", task.title, rowIndex);
      rowCount++;
    } else {
      // console.log("Found task %s in row %s, will update with retrieved content", task.title, rowIndex);
    }
    var taskObjects = getTaskObjects(task);
    if (hasChanged(sheet, rowIndex, taskObjects)) {
        updateSheet(sheet, rowIndex, taskObjects);
        console.log("Updated sheet with task %s", task.title);
    } else {
      // console.log("No change detected in task %s", task.title);
    }
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
    // dueMax: formatDate(getToday()),
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

function updateSheet(sheet, row, taskObjects) {
  for (index = 0; index < taskObjects.length; index++) {
    if (taskObjects[index] === null) {
      sheet.getRange(row,index+1,1,1).clear();
    } else {
      sheet.getRange(row,index+1,1,1).setValue(taskObjects[index]);
    }
  }
}

function getTaskObjects(task) {
  var objects = [task.id, task.title, task.notes, "", ""];
  if (task.due) {
    objects[3] = getStandardizedDate(task.due);
  }
  if (task.completed) {
    objects[4] = getStandardizedDate(task.completed);
  }
  return objects;
}

function hasChanged(sheet, rowIndex, taskObjects) {
  var sheetObjects = sheet.getSheetValues(rowIndex,1,1,5)[0];
  for (index = 0; index < taskObjects.length; index++) {
    var obj1 = sheetObjects[index];
    var obj2 = taskObjects[index];
    if (obj1 instanceof Date) {
      obj1 = obj1.getTime();
    }
    if (obj2 instanceof Date) {
      obj2 = obj2.getTime();
    }
    if (obj1 !== obj2) {
      console.log("Found a change in task %s, with value [%s] changing from %s to %s", taskObjects[1], index, obj1, obj2)
      return true;
    }
  }
  return false;
}

function getStandardizedDate(dateString) {
  var dateObject = new Date(dateString); //date object based on task timezone
  var dateString = formatDate(dateObject); //date string based on UTC
  return new Date(dateString); //Same date/time but UTC based
}

function formatDate(date) {
  return Utilities.formatDate(date, 'UTC', 'MM/dd/yyyy HH:mm:ss');
}
