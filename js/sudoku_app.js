/***
    DEVELOPERS NOTES
    For simplicity purpose I use one js file stored in js folder as angular.min.js
    I used different options for same language constructs to demonstrate different styles, for example: for (;;) and for (in)
    I left commented sections (usually console.logs) for case if a bug is found. Needs to be clean up afterward.
    I tested my solution with Chrome 55.0 and IE11 browsers only.  
*/
    
/***
    
    The idea is to use MVC/AngluarJS for given project.
    There are many ways to structure the code for an application but AngularJS encourage using Model-View-Controller which is
    most suitable for the solution. Algorithm used in the project is Backtracking - probably the simplest algorithms for those kind of
    games. As my hobby I used to create computer board games (checkers, go, my own board games) and very well familiar with this algo.
    
    UI (View):
    As per the project purpose, UI needs to be as minimum as possible but to demonstrate the following:
    - Basic HTML 
    - Demonstrate using CSS
    - Board game needs to be represented as generic AngularJS directive
    
    CODE:
    I tried to be as "wordy" as possible to show my logic. First thing in my mind was rule "think about people who will read it".
    Readability and simplicity are my main focuses here.
    
    LOGIC/BRIDGE (Model/Controller)
    - Used AngularJS custom service for handling solver logic and additional requirements such as updating Sudoku board with new data
    
    INPUT EXTERNAL DEFINITIONS:
    I don't validate if sudoku definition is correct. I tested my solution only with two combinations: from given project and the one 
    I found in internet where they say it is the most difficult sudoku in the worlds...well... I don't know how to prove it. 
        
    MANUAL TESTING (TEST CASES):
    - Default definition data is OK
    - Load simple sudoku data from external source (txt file) with defined format
    - Load hard sudoku data from external source (txt file) with defined format
    - Load incorrect format data file
    - Load empty sudoku definition
    
    Out of scope for manual testing:
    - Load data with correct format but with intentionally incorrect combinations (i.e. same digits in the same row)
    
    For performance test I put in tests directory the most difficult sudoku definitions in the worlds created some very smart math guy. Files called:
    HardestSudokuInTheWorld.txt and AnotherHardestSudokuInTheWorld.txt. There are some other test files in that directory.
    
    UNIT TESTING:
    Unit testing is out of scope for this project but if required it can be done with following set up:
    - Node.js installed. 
    - For the testing suite use Mocha and Chai
    
    PACKAGE HIERARCHY:
    - root - sudoku.html and README.txt
    --- css (for styling)
    --- js (javascript file)
    --- tests (all test cases for manual and performance testing)
    
    DISCLAIMER: 
    Some ideas (such as custom file loader where as standard file loader is not supported by AngularJS) were taken from stackoverflow.
*/


// Define the our `sudokuApp` module
var sudokuApp = angular.module('sudokuApp', []);

// We define a service to manage the game
sudokuApp.service('helper', function() {
    this.doAction = function (initState, finalState, command, data) {
        if(command == 'solve') {
            return solvePuzzle(finalState);
        }
        else if(command == 'update') {
            //Update the board but if anything went wrong, clean up the board
            if(!updatePuzzle(initState, finalState, data)) {
                resetBoard(initState);
                resetBoard(finalState);
                return false;
            }
            else  {
                return true;
            }
        }
    }
});

//duplicate initial state. Slice doesn't work for two dimensional array
this.copyBoard = function(array) {
    copyArray = [];
    
    for(var i = 0; i < 9; i++) {
        copyArray[i] = [];
        for(var j = 0; j < 9; j++) {
            copyArray[i][j] = array[i][j];
        }
    }
    return copyArray;
}

//clean initial state
this.resetBoard = function(array) {
   
    for(var i = 0; i < 9; i++) {
        array[i] = [];
        for(var j = 0; j < 9; j++) {
            array[i][j] = '';
        }
    }
    return array;
}
// I will with standard 'backtracking' algorithm for solving similar problems
// The idea is to use recurssion and plug in all possible values till solution is found or backtrack to original.
// We start from the first row with first empty cell
// Here is idea:
/***
solvePuzzle(board):
	if (board is full)
		return SUCCESS
	else
		next_cell = getNextEmptyCell()
		for each value that can legally be put in next_cell
			put value in nextCell (set legal value)
			if (solvePuzzle(board)) return SUCCESS
		remove value from nextCell (backtrack to a previous state by resetting current value)
	return FAILURE
*/

this.solvePuzzle = function(finalState) {
    
    //arrCells = []
    var next_cell = getNextEmptyCell(finalState);
        
    //Puzzle is solved
    if(next_cell == undefined || next_cell == '') {
        return true;
    }
    
    //console.log('next empty cell: row:' + next_cell.row +" : column:"+ next_cell.column);    

    var legalValues = getAllLegalValues(finalState, next_cell.row, next_cell.column);
    
    //console.log('legal values: '+legalValues);
    
    if(legalValues == undefined || legalValues.length == 0) {
        //console.log('Hello:-)');
        return false;
    }
    
    for(val in legalValues) {
        finalState[next_cell.row][next_cell.column] = legalValues[val];
        //arrCells.push(legalValues[val]);
        if(solvePuzzle(finalState))
            return true;
    }
    
    //backtrack to a previous state
    finalState[next_cell.row][next_cell.column] = undefined;
    //console.log('backtracking to previous cell');
    return false;
            
}

//Simple N2 iteration. Can be optimized in future
this.getNextEmptyCell = function(finalState) {
    //console.log("getNextEmptyCell:enter");
    //console.log('finalState:' + finalState);
    var num;
    for(var i = 0; i < 9; i++) {
        for(var j = 0; j < 9; j++) {
            var cell = finalState[i][j];
            if(cell === undefined || cell == '' || cell === null ) {
                //console.log('found empty cell: i(row)=' + i + ':j(column)=' +j);
                return {column : j, row : i};
            }
            //if values is not empty but is not number, for example multiple blankspaces... weird but can happen
            num = new Number(cell);
            if(num < 1 || num > 9) {
                //console.log('found wierd case');
                return {column : j, row : i};
            }
        }
    }
    //console.log("getNextEmptyCell:exit");
    
}

this.getAllLegalValues = function(finalState, row, col) {
    //console.log("getAllLegalValues:enter");
    
    //Get values from row by elumination existing values
    var arrayRow = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    //console.log("row: "+row);
    for(var i = 0; i < 9; i++) {
        var num = finalState[row][i];
        //console.log(num);
        //find existing values in arrayRow and set it to 0 to ignore it
        for(var j = 0; j < 9; j++) {
            if (arrayRow[j] == num)
                arrayRow[j] = 0;
        }
        
    }
    //console.log(arrayRow);
    
    //Get values from column by elumination existing values
    var arrayCol = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    //console.log("column: "+col);
    for(var i = 0; i < 9; i++) {
        var num = finalState[i][col];
        //console.log(num);
        //find existing values in arrayCol and set it to 0 to ignore it
        for(var j = 0; j < 9; j++) {
            if (arrayCol[j] == num)
                arrayCol[j] = 0;
        }
        
    }
    //console.log(arrayCol);
    
    //Merging two arrays finding matches
    arr = [];
    var seq = 0;
    
    for(var i = 0; i < 9; i++) {
        var numRow = arrayRow[i];
        if (numRow == 0)
            continue;
        for(var j = 0; j < 9; j++) {
            var numCol = arrayCol[j];
            if (numCol == 0)
                continue;
            
            if(numCol == numRow) {
                //using subscr just for fun, can be used push
                arr[seq++] = numCol ;
            }
        }
    }
    //console.log(arr);
    
    //Check current box
    var boxRow = Math.floor(row / 3);
    var boxCol = Math.floor(col / 3);
    
    //console.log('Box: '+boxRow +':'+ boxCol);
    
    //Find all possible values from box
    var box = getBoxLegalArray(finalState, boxRow, boxCol);
    
    //Last merge
    finalArr = [];
    for(var i = 0; i < arr.length; i++) {
        for(var j = 0; j <  box.length; j++ ) {
            //console.log('comparison: ' + arr[i]+':'+box[j]);
            if(arr[i] == box[j]) {
                finalArr.push(arr[i]);
            }
        }
    }
    //console.log('Final Array: ' + finalArr);
    
    //console.log("getAllLegalValues:exist");
    
    return finalArr;
}

this.getBoxLegalArray = function(finalState, boxRow, boxCol) {
    //console.log("getBoxArray:enter");
    arrBox = [];
    var array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    var startRow = boxRow * 3;
    var startCol = boxCol * 3;
    
    for(var i = startRow; i < (startRow+3); i++) {
        for(var j = startCol; j < (startCol+3); j++) {
            var val = finalState[i][j];
            
            if(val == undefined)
                continue;
            //arr.push(val);
            array[val-1] = 0;
        }
    }
    for (var i = 0; i < 9; i++)
        if(array[i] != 0)
            arrBox.push(array[i]);
    //console.log("box array of possible values:"+arrBox);
    
    //console.log("getBoxArray:exist");
    return arrBox;
}

//Data has to be row layered and each element needs to be comma separeted
// For this project I don't check for wrong input format and types
this.updatePuzzle = function(initState, finalState, data) {
    var lines = data.split("\n")
            
    for(var i = 0; i < 9; i++){
        var line = lines[i];
        
        //console.log(line);
        
        if(line == undefined) {
            //I left console.log to find out what went wrong
            console.log('# line = ' + line);
            return false;
        }
        
        for(var j = 0; j < 9; j++){
            var elem = line.split(',');
            
            if(elem.length != 9) {
                //I left console.log to find out what went wrong
                console.log('# elems = ' + elem.length);
                return false;
            }
            initState[i][j] = elem[j];
        }
    }
    
    return true;
}

//Custom deirective to listen onChange event as it is not supported by AngularJS
//Disclaimer: taken as ready sample from stackoverflow... 
sudokuApp.directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeHandler = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeHandler);
    }
  };
});
  
// Here I define the `SudokuController` controller for the `sudokuApp` module
sudokuApp.controller('SudokuController', function SudokuController($scope, helper) {    

    //default data for the project
    $scope.initState = 
    [
        [8, 5, 6, , 1, 4, 7, 3, ],
        [, 9, , , , , , , ],
        [2, 4, , , , , 1, 6, ],
        [, 6, 2, , 5, 9, 3, , ],
        [, 3, 1, 8, , 2, 4, 5, ],
        [, , 5, 3, 4, , 9, 2, ],
        [, 2, 4, , , , , 7, 3],
        [, , , , , , , 1, ],
        [, 1, 8, 6, 3, , 2, 9, 4]
    ]
      
    $scope.finalState = 
    [
        [, , , , , , , , ],
        [, , , , , , , , ],
        [, , , , , , , , ],
        [, , , , , , , , ],
        [, , , , , , , , ],
        [, , , , , , , , ],
        [, , , , , , , , ],
        [, , , , , , , , ],
        [, , , , , , , , ]
    ]
    
            
    
    $scope.info = "Press 'Solve' button to solve the puzzle. Press 'Load File' button to load new sudoku puzzle. ";
    
    //If we want to load data file with new sudoku
    $scope.uploadFile = function(event) {
        var input = event.target;
        
        var reader = new FileReader();
        //$httpBackend = $injector.get('$httpBackend');
        reader.onload = function(){
            var data = reader.result;
            //Should be in separeted function.
            $scope.finalState = 
            [
                [, , , , , , , , ],
                [, , , , , , , , ],
                [, , , , , , , , ],
                [, , , , , , , , ],
                [, , , , , , , , ],
                [, , , , , , , , ],
                [, , , , , , , , ],
                [, , , , , , , , ],
                [, , , , , , , , ]
            ]
    
            var ok = helper.doAction($scope.initState, $scope.finalState, 'update', data);
            
            if(!ok) {
                alert("Something wrong with format of your Sudoku file");
                $scope.info = 'Upload failed. Something wrong with your file format. Please, see log :-(';
            }
            else {
                $scope.info = 'File has been uploaded successfully:-)';
            }
            
            $scope.$apply()
        };
        reader.readAsText(input.files[0]);
        

    };
      
    //Most likely it won't work in Chrome but I leave it for a while
    /*
    readTextFile("./init.txt");
    
    function readTextFile(file)
    {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = function ()
        {
            if(rawFile.readyState === 4)
            {
                if(rawFile.status === 200 || rawFile.status == 0)
                {
                    var allText = rawFile.responseText;
                    alert(allText);
                }
            }
        }
        rawFile.send(null);
    */
      
    $scope.solve = function() {
        start = + new Date();
        //Using shell copy as to avoid referencing to source and splice doesn't work for two dimensional arrays
        $scope.finalState = copyBoard($scope.initState);
            
        var ok = helper.doAction($scope.initState, $scope.finalState, 'solve', '');
        if(ok) {
            $scope.info = 'You are smart...well, computer was smart:-)';
        }
        else {
            $scope.info = 'Well... you know...';
        }
        $scope.info = 'Executing time ' + (new Date() - start) + ' milliseconds';
        
    }

  
});