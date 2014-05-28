// Possible future additions: (ToDos)
// 1. Refactor code to be more concise.
// 2. Implement a step counter and stop the counter if no more moves are left
// 3. Make config object accessible throgh the UI 
// 4. Add buttons in the UI i.e. start, stop, etc...
// 5. Try an HTML5 canvas implementation
// 6. Make grid interactive so that users can toggle cell states by mouse clicks
// 7. Create a way for users to upload patterns
// 8. Write unit tests

/**
 *  Used this site to validate work http://projects.abelson.info/life/
 */

var	dead = 0;
var	alive = 1;

var life = {
	board: new Array(),
	// ToDo: add a step counter in the UI that stops when no more moves are left
	step: 0,
	
	/**
	 * Initialize the entire grid with 'dead' cells
	 * @param Array(array) board
	 * @param Int rows
	 * @param Int cols
	 * @returns Array
	 */
	init: function(board, rows, cols){
		for(var i = 0; i < rows; i++) {
			board[i] = new Array();
			for(var j = 0; j < cols; j++) {
				board[i][j] = dead;
			}
		}
		return board;
	},

	/**
	 * Initialize the array and populate 20% with live cells
	 * @param Array arr
	 * @param Int rows
	 * @param Int cols
	 * @returns Array
	 */
	setUp: function(arr, rows, cols, pattern) {
		if(pattern !== false) {
			var glider_gun = new Array();
			grid = this.init(arr, 50, 70);
			glider_gun = [ 
				[0,4], [0,5], 
				[1,4], [1,5], 
				[10,3], [10,4],	[10,5],
				[11,2], [11, 6],
				[12,1], [12,7],
				[13,1], [13,7],
				[14,4],
				[15,2], [15,6],
				[16,3],	[16,4],	[16,5],
				[17,4],
				[20,5],	[20,6],	[20,7],
				[21,5],	[21,6],	[21,7],
				[22,4],	[22,8],
				[24,3],	[24,4], [24,8],	[24,9],
				[34,6],	[34,7], 
				[35,6],	[35,7]
			];
			
			//select 0,0 for glider offsets
			for(var i = 0; i < glider_gun.length; i++){
				var offset_x = glider_gun[i][0];
				var offset_y = glider_gun[i][1];
				grid[15 - offset_y][55 - offset_x] = alive;
			}
			return grid;
		} else {
			this.init(arr, rows, cols);
			var row_x, col_y;
			// Populate 20% of the grid with 'live' cells
			for(var i=0; i < ( rows * cols * .2); i++) {
				row_x = this.randomNumGen(0,rows);
				col_y = this.randomNumGen(0,cols);

				// If cell is already alive run loop one more time
				if(arr[row_x][col_y] == alive) {
					i--;
				} else {
					arr[row_x][col_y] = alive;				
				}
			}
		}

		return arr;
	},
	/**
	 * Takes a grid and calculates new values after 1 step
	 * @param Array board
	 * @param Int rows
	 * @param Int cols
	 * @returns Array
	 */
	tick: function(board, rows, cols){
		// We need this tempArr since JS passes everything by 
		// reference. We don't want array values to be changed before 
		// we can evaluate the original values first.
		var tempArr = [];
		for(var i=0; i < rows; i++) {
			tempArr[i] = board[i].slice();
		}

		// Go through each cell and evaluate based on the following rules
		// If alive and has less than 2 alive neighbors then DIE
		// If alive and have 2 or 3 alive neighbors then STAY ALIVE
		// If alive and have more than 3 alive neighbors then DIE
		// If dead and have 3 live neighbors then BECOME ALIVE
		for(var i=0; i < rows; i++) {
			for(var j=0; j < cols; j++) {
				// If alive
				aliveNeighbors = this.checkNeighbors(board, i, j, rows, cols);
				if(tempArr[i][j] == alive) {
					if(aliveNeighbors < 2){
						tempArr[i][j] = dead;
					}
					if (aliveNeighbors > 3) {
						tempArr[i][j] = dead;
					}
				}	else {
					// Cell is dead so check to see if it has 3 live neighbors if 
					// true then bring it back to life
					if (aliveNeighbors == 3) {
						tempArr[i][j] = alive;
					}
				}
			}
		}

		return tempArr;
	},
	/**
	 * Return the number of Alive neighbors
	 * @param array board
	 * @param integer x
	 * @param integer y
	 * @returns int
	 */
	checkNeighbors: function(board, x, y, rows, cols) {
		// [-1, -1] [-1, 0] [-1, 1]
		// [ 0, -1] [ 0, 0] [ 0, 1]
		// [ 1, -1] [ 1, 0] [ 1, 1]
		aliveNeighbors = 0;
		//console.log(typeof board[x-1][y-1] === 'undefined' );
		// [TL] [T] [TR]
		if( x - 1 >= 0) {
			if( y - 1 >= 0) {
				if(board[x-1][y-1] == alive) {
					aliveNeighbors++;
				}
			}
			if(board[x-1][y] == alive) {
				aliveNeighbors++;
			}
			if( y + 1 < cols) {
				if(board[x-1][y+1] == alive) {
					aliveNeighbors++;
				}
			}
		}
		// [L] [R]
		if( y - 1 >= 0) {
			if(board[x][y-1] == alive) {
				aliveNeighbors++;
			}
		}
		if( y + 1 < cols) {
			if(board[x][y+1] == alive) {
				aliveNeighbors++;
			}
		}
		// [BL] [B] [BR] 
		if( x + 1 < rows ) {
			if( y - 1 >= 0) {
				if(board[x+1][y-1] == alive) {
					aliveNeighbors++;
				}
			}
			if(board[x+1][y] == alive) {
				aliveNeighbors++;
			}
			if( y + 1 < cols) {
				if(board[x+1][y+1] == alive) {
					aliveNeighbors++;
				}
			}
		}
		//console.log('['+x+', '+ y+'] has ' + aliveNeighbors + ' alive neighbors');
		return aliveNeighbors;
	},
	/**
	 * Render the HTML for a given grid
	 * @param Array
	 * @returns String
	 */
	render: function(arr) {
		var html = '';
		
		for(var i=0; i < arr.length; i++) {
			html += '<tr>';
			for(var j=0; j < arr[i].length; j++) {
				cls = (arr[i][j]) ? 'alive' : 'dead';
				html += '<td class="'+cls+'"></td>';
			}
			html += '</tr>';
		}
		return html;
	},
  /**
	 * Recursively calls itself and iterate over a given grid 
	 * @param Array board
	 * @param Int step
	 * @param Int rows
	 * @param Int cols
	 * @returns void
	 */
	continuous: function(board, step, rows, cols) {
		step++;
		grid = this.tick(board, rows, cols);
		html = this.render(grid);

		// redraw the grid with updated cells
		document.getElementById('grid').innerHTML = html;
		// ToDo: Find out why counting steps not working as intended
		//document.getElementById('step').innerHTML = step;
		
		setInterval(function() {
			life.continuous(grid, step, rows, cols);
		}, 700);
	},
	
	/**
	 * Main function called with window.onload()
	 * @param Array arr
	 * @param Object config
	 * @returns void
	 */
	run: function(arr, config) {
		// When pattern is set to TRUE grid will display Gosper Glider Gun
		var board = this.setUp(arr, config.rows, config.cols, /*pattern*/false);
		// render the original grid
		document.getElementById('original_grid').innerHTML = this.render(board);

		life.continuous(board, this.step, config.rows, config.cols);
	},
	
	/**
	 * Given MIN & MAX range returns an integer value
	 * @param int min
	 * @param int max
	 * @returns int
	 */
	randomNumGen: function(min, max) {
		return Math.floor(Math.random() * (max - min) + min);
	}
};

