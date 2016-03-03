// Generated by CoffeeScript 1.9.3
(function() {
  window.Table = (function() {
    function Table() {
      this.$table = $('<table></table>');
      this.$elementSelected = [];
      this.columnNumber = 0;
      this.lineNumber = 0;
      this.mouseDown = false;
      this.$table.on({
        tableBuilt: (function(_this) {
          return function() {
            return _this.tableChanged();
          };
        })(this),
        rowCreated: (function(_this) {
          return function() {
            return _this.tableChanged();
          };
        })(this),
        headerCellCreated: (function(_this) {
          return function() {
            return _this.tableChanged();
          };
        })(this)
      });
    }

    Table.prototype.createLine = function() {
      return $('<tr></tr>');
    };

    Table.prototype.createHeadCell = function(text, column, $button) {
      var $content, $element;
      $element = $('<th></th>').addClass('column dropper').attr('dropzone', 'move');
      if (column === 0) {
        $element.attr('draggable', 'false');
      } else {
        $element.addClass('draggable').attr('draggable', 'true');
      }
      $content = $('<div></div>').addClass('content');
      if (($button != null)) {
        $content.append($button);
      } else {
        $content.text(text);
      }
      $element.append($content);
      return $element;
    };

    Table.prototype.createCell = function(column, draggable, dropper, content) {
      var $element;
      $element = $('<td></td>');
      if (column === 0) {
        $element.addClass('row');
      } else {
        $element.addClass('cell');
        this.applyCellSelectEvents($element);
      }
      if (draggable) {
        $element.addClass('draggable').attr('draggable', 'true');
      }
      if (dropper) {
        $element.addClass('dropper');
      }
      if (content) {
        $element.append(content);
      }
      return $element;
    };

    Table.prototype.buildHeader = function() {
      var $button, $element, $line;
      $line = this.createLine();
      $button = $('<div></div>').addClass('add_row').text('Add row');
      $button.on({
        click: (function(_this) {
          return function() {
            return _this.addRow();
          };
        })(this)
      });
      $element = $('<th></th>').addClass('add_row column row dropper').append($button);
      $element.attr({
        draggable: 'false',
        dropzone: 'move'
      });
      $line.append($element);
      this.$table.append($line);
      this.columnNumber = 1;
      return this.lineNumber = 1;
    };

    Table.prototype.getTableNode = function() {
      return this.$table;
    };

    Table.prototype.getNumColumn = function($cell) {
      var index, total, total_of_line;
      index = $cell.index() + 1;
      total_of_line = $cell.parent('tr').find('td').length;
      total = this.columnNumber;
      return total - total_of_line + index;
    };

    Table.prototype.getColumn = function(column) {
      return this.$table.find("tr th:nth-child(" + column + "), tr td:nth-child(" + column + ")");
    };

    Table.prototype.createItem = function($src_copy, $dest) {
      var $new_src;
      $new_src = $dest.append($src_copy);
      return this.$table.trigger('itemCreated', [$new_src]);
    };

    Table.prototype.moveItem = function($src, $src_copy, $dest) {
      $dest.append($src_copy);
      $src.trigger('itemMoved', [$src_copy]);
      return $src.remove();
    };

    Table.prototype.moveRow = function($src, $src_copy, $dest) {
      var $elem, $new_dest, $next, $row, $temp, $tr, elem, i, k, l, len, len1, m, n, new_elements, ref, ref1, ref2, ref3, ref4, results, rowspan_dest, rowspan_src;
      rowspan_src = (ref = $src.children().eq(0).attr('rowspan')) != null ? ref : 1;
      rowspan_dest = (ref1 = $dest.children().eq(0).attr('rowspan')) != null ? ref1 : 1;
      $new_dest = $dest;
      for (i = k = 1, ref2 = rowspan_dest - 1; k <= ref2; i = k += 1) {
        $new_dest = $new_dest.next();
      }
      $new_dest = $src_copy.insertAfter($new_dest);
      new_elements = [$new_dest];
      $next = $src.next();
      $src.remove();
      for (i = l = 1, ref3 = rowspan_src - 1; l <= ref3; i = l += 1) {
        $new_dest = $next.clone().insertAfter($new_dest);
        new_elements.push($new_dest);
        $temp = $next.next();
        $next.remove();
        $next = $temp;
      }
      results = [];
      for (m = 0, len = new_elements.length; m < len; m++) {
        $tr = new_elements[m];
        $row = $tr.find('.row');
        this.$table.trigger('rowMoved', [$row]);
        ref4 = $tr.find('td');
        for (n = 0, len1 = ref4.length; n < len1; n++) {
          elem = ref4[n];
          $elem = $(elem);
          this.applyCellSelectEvents($elem);
          this.$table.trigger('cellMoved', [$elem]);
        }
        results.push((function() {
          var len2, o, ref5, results1;
          ref5 = $tr.find('.item');
          results1 = [];
          for (o = 0, len2 = ref5.length; o < len2; o++) {
            elem = ref5[o];
            results1.push(this.$table.trigger('itemMoved', [$(elem)]));
          }
          return results1;
        }).call(this));
      }
      return results;
    };

    Table.prototype.moveColumn = function($src, $src_copy, $dest) {
      var $elements_dest, $elements_src, column_dest, column_src, i, k, ref, results;
      column_src = this.getNumColumn($src);
      column_dest = this.getNumColumn($dest);
      if (column_src === column_dest) {
        return;
      }
      $elements_src = this.getColumn(column_src);
      $elements_dest = this.getColumn(column_dest);
      $src = $elements_src.eq(0);
      $src_copy = $src.clone();
      $dest = $elements_dest.eq(0);
      $src_copy.insertAfter($dest);
      this.$table.trigger('headerCellMoved', [$src_copy]);
      $src.remove();
      results = [];
      for (i = k = 1, ref = $elements_src.length - 1; k <= ref; i = k += 1) {
        $src = $elements_src.eq(i);
        $src_copy = $src.clone();
        $dest = $elements_dest.eq(i);
        $src_copy.insertAfter($dest);
        this.$table.trigger('cellMoved', [$src_copy]);
        $src_copy.find('.item').each((function(_this) {
          return function(i, elem) {
            return $src.trigger('itemMoved', [$(elem)]);
          };
        })(this));
        results.push($src.remove());
      }
      return results;
    };

    Table.prototype.checkIfNotSplittable = function($element, n_splits) {

      var $td, $tr, i, k, n_line, nb_cells, ref, rowspan;
      n_line = parseInt($element.attr('rowspan'));
      if (!n_line) {
        n_line = 1;
      }
      if (n_line === 1) {
        return false;
      }
      nb_cells = 1;
      $tr = $element.closest('tr');
      $td = $element.next();
      rowspan = $td.attr('rowspan') || 1;
      n_line -= rowspan;
      while (n_line !== 0) {
        for (i = k = 0, ref = rowspan - 1; k <= ref; i = k += 1) {
          $tr = $tr.next();
        }
        rowspan = $tr.find('td:nth-child(1)').attr('rowspan') || 1;
        n_line -= rowspan;
        nb_cells += 1;
      }
      if (nb_cells % n_splits === 0) {
        return false;
      }
      return true;
    };

    Table.prototype.splitCellWithRowspan = function($element, n_splits, rowspan) {
      var $cell, $tr, i, k, new_rowspan, ref, ref1, ref2, results;
      new_rowspan = rowspan / n_splits;
      $element.attr('rowspan', new_rowspan);
      $tr = $element.closest('tr').nextAll('tr');
      results = [];
      for (i = k = ref = new_rowspan - 1, ref1 = rowspan - 2, ref2 = new_rowspan; ref2 > 0 ? k <= ref1 : k >= ref1; i = k += ref2) {
        $cell = this.createCell(1, false, true).attr('rowspan', new_rowspan);
        results.push($tr.eq(i).prepend($cell));
      }
      return results;
    };

    Table.prototype.splitCellWithNoneRowspan = function($element, n_splits) {
      var $cell, $cells, $new_tr, $prev, $tr, i, i_merge, j, k, l, min_cells_to_have, new_num_column, num_column, number_of_cells_to_merge, number_of_cells_to_split, ref, ref1, rowspan, rowspan_attribute;
      if (!$element.hasClass('cell')) {
        return;
      }
      num_column = this.getNumColumn($element);
      number_of_cells_to_split = this.columnNumber - num_column + 1;
      number_of_cells_to_merge = this.columnNumber - number_of_cells_to_split;
      $tr = $element.parent('tr');
      for (i = k = 0, ref = n_splits - 2; k <= ref; i = k += 1) {
        $new_tr = $('<tr></tr>');
        for (j = l = 0, ref1 = number_of_cells_to_split - 1; l <= ref1; j = l += 1) {
          new_num_column = num_column + j;
          $cell = this.createCell(new_num_column, false, true);
          this.$table.trigger('cellMoved', [$cell]);
          $new_tr.append($cell);
        }
        $new_tr.insertAfter($tr);
      }
      $prev = $element.prev();
      i_merge = number_of_cells_to_merge - 1;
      while (i_merge !== -1) {
        while ($prev.length === 0) {
          $tr = $tr.prev();
          if ($tr.length === 0) {
            console.err('Error when splitting cell');
            return;
          }
          $cells = $tr.find('td');
          min_cells_to_have = number_of_cells_to_split + (number_of_cells_to_merge - i_merge);
          if ($cells.length > min_cells_to_have) {
            $prev = $cells.eq(i_merge);
          }
        }
        rowspan = n_splits;
        rowspan_attribute = $prev.attr('rowspan');
        if (rowspan_attribute) {
          rowspan = parseInt(rowspan_attribute, 10) + parseInt(n_splits, 10) - 1;
        }
        $prev.attr('rowspan', rowspan);
        i_merge -= 1;
        $prev = $prev.prev();
      }
    };

    Table.prototype.splitCell = function($element, n_splits) {
      var rowspan;
      rowspan = $element.attr('rowspan');
      if (rowspan && rowspan > 1) {
        return this.splitCellWithRowspan($element, n_splits, rowspan);
      } else {
        return this.splitCellWithNoneRowspan($element, n_splits);
      }
    };

    Table.prototype.checkIfNotMergeable = function($elements) {
      var $element, $first_parent_cell, $parent_cell, $parent_line, column, i, j, k, l, m, ref, ref1, ref2;
      column = this.getNumColumn($elements.eq(0));
      for (i = k = 1, ref = $elements.length - 1; 1 <= ref ? k <= ref : k >= ref; i = 1 <= ref ? ++k : --k) {
        if (this.getNumColumn($elements.eq(i)) !== column) {
          return true;
        }
      }
      $first_parent_cell = null;
      for (i = l = 0, ref1 = $elements.length - 1; l <= ref1; i = l += 1) {
        $element = $elements.eq(i);
        $parent_cell = $element.prev();
        if ($parent_cell.length === 0) {
          $parent_line = $element.closest('tr');
          for (j = m = 0, ref2 = i - 1; m <= ref2; j = m += 1) {
            $parent_line = $parent_line.prev();
          }
          $parent_cell = $parent_line.find('td').eq(column - 2);
        }
        if ($first_parent_cell !== null && $parent_cell.is($first_parent_cell) === false) {
          return true;
        }
        $first_parent_cell = $parent_cell;
      }
      return false;
    };

    Table.prototype.mergeCells = function($elements) {
      var $first_element, $previous_element, $save_items, $to_save_element, actual_rowspan, i, j, k, length, ref, results;
      $save_items = [];
      length = $elements.length;
      $first_element = $elements.eq(0);
      if (length <= 1) {
        return;
      }
      $save_items = [];
      for (i = k = 1, ref = length - 1; k <= ref; i = k += 1) {
        $to_save_element = $elements.eq(i);
        j = 0;
        while (true) {
          if ($save_items[j] == null) {
            $save_items[j] = [];
          }
          $save_items[j].push($to_save_element.find('.item'));
          $to_save_element = $to_save_element.next();
          j++;
          if ($to_save_element.length === 0) {
            break;
          }
        }
        $elements.eq(i).parent('tr').remove();
      }
      $previous_element = $first_element.prev();
      while ($previous_element.length !== 0) {
        actual_rowspan = $previous_element.attr('rowspan') || 1;
        $previous_element.attr('rowspan', actual_rowspan - length + 1);
        $previous_element = $previous_element.prev();
      }
      j = 0;
      results = [];
      while (true) {
        $first_element.append($save_items[j]);
        $first_element = $first_element.next();
        if ($first_element.length === 0) {
          break;
        }
        results.push(j++);
      }
      return results;
    };

    Table.prototype.tableChanged = function() {
      return this.$table.trigger('tableChanged');
    };

    Table.prototype.buildTable = function() {
      this.$table.addClass('resizable');
      this.buildHeader();
      return this.$table.trigger('tableBuilt');
    };

    Table.prototype.addRow = function() {
      var $cell, $delete, $header_cell, $line, j, k, ref;
      $line = this.createLine();
      $delete = $('<span></span>').addClass('span_action glyphicon glyphicon-remove');
      $delete.on({
        click: (function(_this) {
          return function(event) {
            var $elem, $next, $temp, $tr, i, k, ref, ref1, rowspan;
            $elem = $(event.currentTarget);
            $tr = $elem.closest('tr');
            rowspan = (ref = $tr.children().eq(0).attr('rowspan')) != null ? ref : 1;
            $next = $tr.next();
            $tr.find('.item').trigger('toRemove');
            $tr.remove();
            for (i = k = 1, ref1 = rowspan - 1; k <= ref1; i = k += 1) {
              $temp = $next.next();
              $next.find('.item').trigger('toRemove');
              $next.remove();
              $next = $temp;
            }
            return _this.lineNumber -= 1;
          };
        })(this)
      });
      $header_cell = this.createCell(0, true, true, $delete);
      $line.append($header_cell);
      this.$table.trigger('headerCellCreated', [$header_cell]);
      for (j = k = 2, ref = this.columnNumber; k <= ref; j = k += 1) {
        $cell = this.createCell(j, false, true);
        $line.append($cell);
        this.$table.trigger('cellCreated', [$cell]);
      }
      this.$table.append($line);
      this.lineNumber += 1;
      return this.$table.trigger('rowCreated', [$line]);
    };

    Table.prototype.addColumn = function(name) {
      var $cell, $header, $trs, i, k, ref;
      $header = this.createHeadCell(name, this.columnNumber);
      $trs = this.$table.find('tr');
      $trs.eq(0).append($header);
      for (i = k = 1, ref = $trs.length - 1; k <= ref; i = k += 1) {
        $cell = this.createCell(i, false, true);
        $trs.eq(i).append($cell);
        this.$table.trigger('cellCreated', [$cell]);
      }
      this.columnNumber += 1;
      return this.$table.trigger('headerCellCreated', [$header]);
    };

    Table.prototype.setMouseDown = function(state) {
      return this.mouseDown = state;
    };

    Table.prototype.getHeaderCellContent = function($cell) {
      var col;
      col = this.getNumColumn($cell) - 1;
      return this.$table.find('th').eq(col).find('.content').text();
    };

    Table.prototype.findCell = function(line, column) {
      return this.$table.find("tr:nth-child(" + line + ") th:nth-child(" + column + "), tr:nth-child(" + line + ") td:nth-child(" + column + ")");
    };

    Table.prototype.getLineNumber = function() {
      return this.lineNumber;
    };

    Table.prototype.clear = function() {
      this.$table.empty();
      return this.buildTable();
    };

    Table.prototype.applyCellSelectEvents = function($element) {
      return $element.on({
        mouseover: (function(_this) {
          return function(e) {
            if (_this.mouseDown === true) {
              return $element.addClass('selected');
            }
          };
        })(this),
        mousedown: (function(_this) {
          return function(e) {
            var has_class;
            if (e.which === 3) {
              if ($element.hasClass('selected') === false) {
                if (!e.ctrlKey) {
                  $('.selected').removeClass('selected');
                }
                return $element.addClass('selected');
              }
            } else {
              if (e.ctrlKey) {
                return $element.toggleClass('selected');
              } else {
                has_class = $element.hasClass('selected');
                $('.selected').removeClass('selected');
                if (!has_class) {
                  return $element.addClass('selected');
                }
              }
            }
          };
        })(this)
      });
    };

    return Table;

  })();

}).call(this);