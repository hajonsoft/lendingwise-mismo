/* jQuery sticky notes plugin v1.0: 9-MARCH-2015

   Copyright 2015, Mritunjay Kumar (http://www.checkoutall.com/)

   A jQuery plugin for implemeting sticky notes in a web site quickly.
   Documentation here: http://www.checkoutall.com/jQuery/StickyNote/

   This script is free software. You may modify and/or use it whereever you want,
   without any restriction, limitation and warranty.
*/

jQuery(document).ready(function ($) {

    $.CoaStickyNote = function (element, options) {

        var defaults = {
            // Set true if want to make the sticky note resizable! By default it's false.
            resizable: false,

            // Default note theme. This will be used when new note will be created!
            // text: Text, which will be visible in dropdown. So, user can choose one. 
            //       And this value may also be used in saving the preferred theme for each note box.
            // value: The css class, which will be applied to the outer div of the note box.
            defaultTheme: {text: "Yellow", value: "sticky-note-yellow-theme"},

            // Array of available note themes. Each object of array need to contain 2 properties:
            // text: Text, which will be visible in dropdown. So, user can choose one. 
            //       And this value may also be used in saving the preferred theme for each note box.
            // value: The css class, which will be applied to the outer div of the note box.
            availableThemes: [],

            // Set default note position, which will be set when a new note will be created!
            // top: Position from top
            // left: Position from left
            notePosition: {top: "10px", left: "10px"},

            // Set default note dimension, which will be set when a new note will be created!
            // width: width of the note div
            // height: Height of the note div
            noteDimension: {width: "235px", height: "200px"},

            // Set default note box text, which will be set when a new note will be created!
            noteText: "New note box!",

            // Set note text max length. By default it will be set to 0.
            // If this max length value will be greater than 0, then it will be applied as maxlength 
            // attribute to the note textarea.
            noteTextMaxLength: 0,

            // Set default note box header text, which will be set when a new note will be created!
            noteHeaderText: "New note!",

            // Set note header text max length. By default it will be set to 0.
            // If this max length value will be greater than 0, then it will be applied as maxlength 
            // attribute to the note header textbox.
            noteHeaderTextMaxLength: 0,

            // Set text for close/ delete link click text, which will be set for all note box!
            deleteLinkText: "<i class='fa fa-trash'></i>",

            // Set text for options link click text, which will be set for all note box!
            optionsLinkText: "",

            // Set the minimum z-index here. And all note box z-index will greater or equal to this value.
            startZIndex: 10,

            // It will decide that the added/ loaded note box will be in sleeping/ readonly mode or not.
            // true: In sleeping/ readonly mode
            // false: Active/ Editable
            sleeping: false,

            // It will contain different z-index for each create notes.
            zIndex: 1,

            maximize: 1,

            /*
            In all the below events, you can access note object. This note contains everything, regarding respective note.
            */
            // Use this event, if you want to perform some operation before creating a new note box.
            // Return false, if you want to abort the create new note request.
            beforeCreatingNoteBox: empty,

            // Use this event, if you want to perform some operation after creating a new note box. 
            // Like save it on server/ local storage!
            onNoteBoxCreated: empty,

            // Use this event, if you want to perform some operation while updating note box header text.
            // Return false, if you want to abort the update note box header request!
            // You may also save the update header text on server/ local storage!
            onNoteBoxHeaderUpdate: empty,

            // Use this event, if you want to perform some operation while updating note box text.
            // Return false, if you want to abort the update note box text request!
            // You may also save the update note text on server/ local storage!
            onNoteBoxTextUpdate: empty,

            // Use this event, if you want to perform some operation while deleting note box.
            // Return false, if you want to abort the delete note request.
            // You may also delete note from server/ local storage!
            onNoteBoxDelete: empty,

            // Use this event, if you want to perform some operation after updating note box dimension.
            // You may also save the note dimension on server/ local storage!
            onNoteBoxResizeStop: empty,

            // Use this event, if you want to perform some operation after updating note box position.
            // You may also save the note position on server/ local storage!
            onNoteBoxDraggingStop: empty,

            // Use this event, if you want to perform some operation after updating note box z-index.
            // You may also save the note z-index on server/ local storage!
            onMovingNoteBoxOnTop: empty,

            // Use this event, if you want to perform some operation after updating note box theme.
            // You may also save the note theme on server/ local storage!
            onThemeSelectionChange: empty,
        };

        // Constants
        var outerCssClass = "each-sticky-note-outer";
        var optionsCssClass = "each-sticky-note-options";
        var deleteCssClass = "each-sticky-note-delete";
        var headerCssClass = "each-sticky-note-header";
        var optionsControlCssClass = "each-sticky-note-options-control";
        var noteTextCssClass = "each-sticky-note-text-box";
        var themeBoxCssClass = "each-sticky-note-themebox";
        var noteBoxSleepingCssClass = "each-sticky-note-outer-sleeping";
        var dataKey = "coaStickyNote";
        var plugin = this;
        plugin.settings = {};
        var $element = $(element);

        plugin.init = function () {
            plugin.settings = $.extend(true, {}, defaults, options);
            $element.click(function () {
                if (allSleeping()) {
                    return;
                }
                createNoteBox($element);
            });
        };

        // Public methods
        plugin.loadExistingNotes = function (existingNotes) {
            if (existingNotes != null && existingNotes.length > 0) {
                for (var counter = 0; counter < existingNotes.length; counter++) {
                    createNoteBox($element, existingNotes[counter]);
                }
            }
        };

        plugin.loadExistingNote = function (existingNote) {
            if (existingNote != null) {
                createNoteBox($element, existingNote);
            }
        };

        plugin.destroy = function () {

            // Remove children
            $element.find("." + outerCssClass).each(function () {
                $(this).find("." + headerCssClass).each(function () {
                    $(this).find("input").each(function () {
                        destroy($(this));
                    });
                    destroy($(this));
                });

                $(this).find("." + deleteCssClass).each(function () {
                    destroy($(this));
                });

                $(this).find("." + optionsCssClass).each(function () {
                    $(this).find("." + optionsControlCssClass).each(function () {
                        destroy($(this));
                    });

                    $(this).find("." + themeBoxCssClass).each(function () {
                        $(this).find("select").each(function () {
                            destroy($(this));
                        });
                        destroy($(this));
                    });
                    destroy($(this));
                });

                $(this).find("." + noteTextCssClass).each(function () {
                    $(this).find("textarea").each(function () {
                        destroy($(this));
                    });
                    destroy($(this));
                });

                destroy($(this));
                $(this).removeData();
                $(this).draggable("destroy");
                $(this).resizable("destroy");
            });

            $element.unbind();
            $element.removeData();
        };

        plugin.sleepAll = function () {
            if (!$element.hasClass(noteBoxSleepingCssClass)) {
                $element.addClass(noteBoxSleepingCssClass);
                $element.find("." + outerCssClass).addClass(noteBoxSleepingCssClass);
                $element.find("." + outerCssClass).each(function () {
                    disableUiWidzet($(this));
                });
            }
        };

        plugin.wakeupAll = function () {
            if ($element.hasClass(noteBoxSleepingCssClass)) {
                $element.removeClass(noteBoxSleepingCssClass);
            }
            $element.find("." + noteBoxSleepingCssClass).removeClass(noteBoxSleepingCssClass);
            $element.find("." + outerCssClass).each(function () {
                enableUiWidzet($(this));
            });
        };

        plugin.sleep = function (noteBox) {
            if (!noteBox.hasClass(noteBoxSleepingCssClass)) {
                noteBox.addClass(noteBoxSleepingCssClass);
                disableUiWidzet(noteBox);
            }
        };

        plugin.wakeup = function (noteBox) {
            if (noteBox.hasClass(noteBoxSleepingCssClass)) {
                noteBox.removeClass(noteBoxSleepingCssClass);
                enableUiWidzet(noteBox);
            }
            if (noteBox.parent().hasClass(noteBoxSleepingCssClass)) {
                noteBox.parent().removeClass(noteBoxSleepingCssClass);
            }
        };

        plugin.getNoteBoxById = function (id) {
            return getNoteBox(id, null);
        };

        plugin.getNoteBoxByIndex = function (index) {
            return getNoteBox(null, index);
        };

        //Private methods
        var heightAvailableForNoteText = function ($outerBox, $outerHeaderBox) {
            //  console.log('sdfsd');
            return ($outerBox.height() - $outerHeaderBox.height() - 3);
        };

        var getNoteBox = function (id, index) {
            var matchedNoteBox = null;
            $element.find("." + outerCssClass).each(function () {
                if (matchedNoteBox == null) {
                    var eachNoteData = $(this).data(dataKey);
                    if ((id == null && eachNoteData.index == index) ||
                        (index == null && eachNoteData.id == id)) {
                        matchedNoteBox = $(this);
                    }
                }
            });
            return matchedNoteBox;
        };

        var disableUiWidzet = function ($object) {
            $object.draggable("disable");
            $object.resizable("disable");
        };

        var enableUiWidzet = function ($object) {
            $object.draggable("enable");
            $object.resizable("enable");
        };

        var sleeping = function ($object) {
            if ($object.hasClass(noteBoxSleepingCssClass) ||
                $object.data(dataKey).settings.sleeping ||
                allSleeping()) {
                return true;
            }
            return false;
        };

        var allSleeping = function () {
            if ($element.hasClass(noteBoxSleepingCssClass)) {
                return true;
            }
            return false;
        };

        var nextIndexForNoteBox = function () {
            var lastIndex = 0;
            $element.find('.' + outerCssClass).each(function () {
                var localPlugin = $(this).data(dataKey);
                if (lastIndex < localPlugin.index) {
                    lastIndex = localPlugin.index;
                }
            });
            return (lastIndex + 1);
        };

        var indexIsUnique = function (indexToCheck) {
            var isUnique = true;
            $element.find('.' + outerCssClass).each(function () {
                var localPlugin = $(this).data(dataKey);
                if (indexToCheck == localPlugin.index) {
                    isUnique = false;
                }
            });
            return isUnique;
        };

        var nextZIndexForNoteBox = function () {
            var lastZIndex = 0;
            $('div').find('.' + outerCssClass).each(function () {
                var localPlugin = $(this).data(dataKey);
                var eachZIndex = parseInt(localPlugin.settings.zIndex, 10);
                if (lastZIndex < eachZIndex) {
                    lastZIndex = eachZIndex;
                }
            });

            if (lastZIndex > plugin.settings.zIndex) {
                return (lastZIndex + 1);
            } else {
                return (plugin.settings.zIndex + 1);
            }
        };

        var setOptionsCss = function ($optionsOuter) {
            $optionsOuter.css({left: 10, top: 20, position: "absolute"});
        };

        var valueSet = function (property) {
            if (property == null || property == "") {
                return false;
            }
            return true;
        };

        var destroy = function ($dom) {
            $dom.remove();
            $dom.unbind();
        };

        var setMissingOptions = function (note) {

            // If theme was not set, use default theme!
            if (!valueSet(note.settings.defaultTheme) ||
                !valueSet(note.settings.defaultTheme.value)) {
                note.settings.defaultTheme = plugin.settings.defaultTheme;
            }
            // If dimension not set, use default dimension
            if (!valueSet(note.settings.noteDimension)) {
                note.settings.noteDimension = plugin.settings.noteDimension;
            }
            if (!valueSet(note.settings.noteDimension.width)) {
                note.settings.noteDimension.width = plugin.settings.noteDimension.width;
            }
            if (!valueSet(note.settings.noteDimension.height)) {
                note.settings.noteDimension.height = plugin.settings.noteDimension.height;
            }

            // If position not set, use default dimension
            if (!valueSet(note.settings.notePosition)) {
                note.settings.notePosition = plugin.settings.notePosition;
            }
            if (!valueSet(note.settings.notePosition.top)) {
                note.settings.notePosition.top = plugin.settings.notePosition.top;
            }
            if (!valueSet(note.settings.notePosition.left)) {
                note.settings.notePosition.left = plugin.settings.notePosition.left;
            }

            // More themes options not set!
            if (note.settings.availableThemes == null || note.settings.availableThemes.length == 0) {
                note.settings.availableThemes = [plugin.defaultTheme];
            }
        };

        var updateZIndexForNoteBox = function (outerElement, note) {
            var zIndexToMoveItOnTop = nextZIndexForNoteBox();
            $(outerElement).css("z-index", zIndexToMoveItOnTop);
            $(outerElement).data(dataKey).settings.zIndex = zIndexToMoveItOnTop;
            note.settings.onMovingNoteBoxOnTop(note, $(outerElement));
        };

        var correctNoteTextForHtmlView = function (input) {
            var result = input == null ? "" : input.replace(/\r\n/g, "<br>");
            return result.replace(/\n/g, "<br>");
        };

        var correctNoteTextForEdit = function (input) {
            var result = input == null ? "" : input.replace(/<br>/g, "\n");
            return result;
        };

        var updateNoteHeader = function (noteBox, noteBoxHeader, headerEditBox, note, $headerContainer) {
            var oldHeaderText = note.settings.noteHeaderText;
            note.settings.noteHeaderText = headerEditBox.val();
            headerUpdated = note.settings.onNoteBoxHeaderUpdate(note, noteBox);
            if (headerUpdated == false) {
                note.settings.noteHeaderText = oldHeaderText;
            }
            $headerContainer.html(note.settings.noteHeaderText);
            noteBox.find("." + deleteCssClass + ", ." + optionsCssClass + " , .minimize_sticky_notes,.maximize_sticky_notes, .show_hide_notes").removeClass("hidden-item");
            var noteEditArea = $('textarea', noteBox)[0];
            var chnagedHeightAvail = heightAvailableForNoteText(noteBox, noteBoxHeader);
            // console.log(chnagedHeightAvail);
            if (chnagedHeightAvail > 0) {
                $(noteEditArea).height(chnagedHeightAvail + "px");
            }
        };

        var updateNoteText = function (noteBox, noteBoxHeader, note, noteBoxTextContainer, $this) {
            var olderValue = note.settings.noteText;
            note.settings.noteText = $this.val();
            updatedNoteText = note.settings.onNoteBoxTextUpdate(note, noteBox);
            if (updatedNoteText == false) {
                note.settings.noteText = olderValue;
            }
            // Let the note view box cover available height
            var heightAvailForView = heightAvailableForNoteText(noteBox, noteBoxHeader);
            if (heightAvailForView > 0) {
                //console.log(heightAvailForView);
                noteBoxTextContainer.height(heightAvailForView + "px");
            }
            noteBoxTextContainer.html(correctNoteTextForHtmlView(note.settings.noteText));
            if (note.settings.resizable) {
                noteBox.resizable("option", "alsoResize", noteBoxTextContainer);
            }
        };

        var createNoteBox = function ($this, existingNote) {
            var note = {};
            //console.log("Create Note Box");
            //console.log($this);
            //console.log(existingNote);
            if (existingNote == null) {
                note = {
                    settings: $.extend(true, {}, plugin.settings),
                    index: nextIndexForNoteBox(),
                };
                note.id = note.index;
            } else {
                note.settings = $.extend(true, {}, plugin.settings);
                note.settings = $.extend(true, note.settings, existingNote.settings);
                if (existingNote.id != null) {
                    note.id = existingNote.id;
                }
                if (existingNote.index >= 0 && indexIsUnique(existingNote.index)) {
                    note.index = existingNote.index;
                } else {
                    note.index = nextIndexForNoteBox();
                }
                setMissingOptions(note);
            }

            // If user wants to perform some operation before creating a note box!
            if (existingNote == null) {
                note.settings.zIndex = nextZIndexForNoteBox();
            }

            // Note box outer
            var noteBox = $("<div class='stickyNotesClass " + outerCssClass + " divSticky" + note.id + " "
                + note.settings.defaultTheme.value + "'></div>");

            //console.log(note.settings.maximize);
            if (note.settings.maximize == 1) {
            } else {
                //  console.log("12345");
                note.settings.noteDimension.height = '32px';
                $(".divSticky" + note.id + " > .ui-resizable-handle").hide();
            }
            noteBox.css({
                zIndex: note.settings.zIndex,
                top: note.settings.notePosition.top,
                left: note.settings.notePosition.left,
                width: note.settings.noteDimension.width,
                height: note.settings.noteDimension.height,
            });


            //console.log(note.settings.show);
            if (note.settings.show == 'hide') {
                noteBox.css({
                    display: 'none',
                });
            }
            noteBox.click(function (e) {
                e.stopPropagation();
            });
            noteBox.click(function (clickEvt) {
                if (sleeping(noteBox)) {
                    return;
                }
                updateZIndexForNoteBox(this, note);
                clickEvt.stopPropagation();
            });

            // Note box header
            //console.log(note.settings);
            var noteBoxHeader = $("<div class='" + headerCssClass + " stickyNotesIdHeader" + note.id + "'></div>").html(note.settings.noteHeaderText);
            noteBoxHeader.dblclick(function () {
                if (sleeping(noteBox)) {
                    return;
                }
                if (noteBoxHeader.find("input").length > 0) {
                    return;
                }
                var $headerContainer = $(this);
                var headerEditBox = $('<input type="text"  maxlength="60" style="width: 200px;"/>').val($headerContainer.html());
                if (note.settings.noteHeaderTextMaxLength > 0) {
                    headerEditBox.attr("maxlength", note.settings.noteHeaderTextMaxLength);
                }
                headerEditBox.width($headerContainer.parent().width() - 36 + "px");
                $headerContainer.html('');
                $headerContainer.append(headerEditBox);
                headerEditBox.focus();
                noteBox.find("." + deleteCssClass + ", ." + optionsCssClass + " , .minimize_sticky_notes,.maximize_sticky_notes, .show_hide_notes").addClass("hidden-item");

                headerEditBox.blur(function (evt) {
                    if (sleeping(noteBox)) {
                        return;
                    }
                    updateNoteHeader(noteBox, noteBoxHeader, headerEditBox, note, $headerContainer);
                    evt.stopPropagation();
                });

                headerEditBox.keyup(function (keyEvt) {
                    if (sleeping(noteBox)) {
                        return;
                    }
                    // Enter key, means user done with updating header text
                    keyEvt = keyEvt || window.event;
                    if (keyEvt.keyCode == 13) {
                        updateNoteHeader(noteBox, noteBoxHeader, headerEditBox, note, $headerContainer);
                        keyEvt.stopPropagation();
                    }

                    // Escape key, means user wants to rollback changes!
                    if (keyEvt.which == 27 || keyEvt.keyCode == 27) {
                        noteBox.find("." + deleteCssClass + ", ." + optionsCssClass + " , .minimize_sticky_notes,.maximize_sticky_notes, .show_hide_notes").removeClass("hidden-item");
                        $headerContainer.html(note.settings.noteHeaderText);
                        keyEvt.stopPropagation();
                    }
                });

                headerEditBox.click(function (clickEvt) {
                    clickEvt.stopPropagation();
                });
            });
            // End of Box Header


            // Note box text
            if (note.settings.maximize == 1) {

                var noteBoxTextContainer = $("<div   style='display: block;' class='" + noteTextCssClass + "  " + "stickyNotesDiv" + note.id + "'>"
                    + correctNoteTextForHtmlView(note.settings.noteText) + "</div>");
                // $(".stickyNotesDiv" + note.id).hide();
                //$(".divSticky" + note.id).height('32px');
            } else {

                var noteBoxTextContainer = $("<div style='display: none;' class='" + noteTextCssClass + "  " + "stickyNotesDiv" + note.id + "'>"
                    + correctNoteTextForHtmlView(note.settings.noteText) + "</div>");
                // $(".stickyNotesDiv" + note.id).show();
                //$(".divSticky" + note.id).height($(this).attr('data-attr-origin-height'));
            }
            noteBoxTextContainer.click(function () {
                if (sleeping(noteBox)) {
                    return;
                }
                if (noteBoxTextContainer.find("textarea").length > 0) {
                    return;
                }
                var $textContainer = $(this);
                var noteEditBox = $('<textarea></textarea>').val(correctNoteTextForEdit($textContainer.html()));
                if (note.settings.noteTextMaxLength > 0) {
                    noteEditBox.attr("maxlength", note.settings.noteTextMaxLength);
                }
                $(this).html('');
                $(this).append(noteEditBox);
                noteEditBox.focus();

                // Let the note textarea cover available height
                noteEditBox.parent().css("height", "auto");
                var heightAvailForEdit = heightAvailableForNoteText(noteBox, noteBoxHeader);
                // console.log(heightAvailForEdit);
                if (heightAvailForEdit > 0) {
                    noteEditBox.height(heightAvailForEdit - 10 + "px");
                }
                if (note.settings.resizable) {
                    noteBox.resizable("option", "alsoResize", noteEditBox);
                }
                noteEditBox.blur(function (evt) {
                    if (sleeping(noteBox)) {
                        return;
                    }
                    updateNoteText(noteBox, noteBoxHeader, note, noteBoxTextContainer, $(this));
                    //  $('.each-sticky-note-outer').click(function(){
                    var index_highest = 0;

                    $(".each-sticky-note-outer").each(function () {
                        // always use a radix when using parseInt
                        var index_current = parseInt($(this).css("zIndex"), 10);
                        if (index_current > index_highest) {
                            index_highest = index_current;
                        }
                        //console.log(index_highest);
                    });
                    // });


                    evt.stopPropagation();
                });

                noteEditBox.keyup(function (keyEvt) {
                    if (sleeping(noteBox)) {
                        return;
                    }
                    // Enter key, means user done with updating header text
                    keyEvt = keyEvt || window.event;
                    // Escape key, means user wants to rollback changes!
                    if (keyEvt.which == 27 || keyEvt.keyCode == 27) {

                        // Let the note view box cover available height
                        var heightAvailForView = heightAvailableForNoteText(noteBox, noteBoxHeader);
                        // console.log(heightAvailForView);

                        if (heightAvailForView > 0) {
                            noteBoxTextContainer.height(heightAvailForView + "px");
                        }
                        noteBoxTextContainer.html(correctNoteTextForHtmlView(note.settings.noteText));
                        if (note.settings.resizable) {
                            noteBox.resizable("option", "alsoResize", noteBoxTextContainer);
                        }
                        keyEvt.stopPropagation();
                    }
                });
            });
            //End of Note box text


            // Delete function here!
            var noteBoxDelete = $("<div title='Delete Notes' class='" + deleteCssClass + "'>"
                + note.settings.deleteLinkText + "</div>");
            noteBoxDelete.click(function () {
                if (sleeping(noteBox)) {
                    return;
                }
                deleteNote = note.settings.onNoteBoxDelete(note, noteBox);
                if (deleteNote != false) {
                    $(this).parent().remove();
                }
            });
            //End of Delete function here!


            // Minimize Maximize function here!
            if (note.settings.maximize == 1) {
                var noteBoxMinimize = $("<div data-attr-origin-height='" + note.settings.noteDimension.height + "' data-window-size='" + note.settings.maximize + "' class='minimize_sticky_notes fas fa-window-minimize' title='Minimize'></div>");
            } else {
                var noteBoxMinimize = $("<div data-attr-origin-height='" + note.settings.noteDimension.height + "' data-window-size='" + note.settings.maximize + "' class='maximize_sticky_notes fas fa-window-maximize' title='Maximize'> </div>");
            }
            noteBoxMinimize.click(function () {
                if (sleeping(noteBox)) {
                    return;
                }
                maximizeNote = note.settings.onNoteBoxMinimize(note, noteBox, $(this).attr('data-window-size'));

                //console.log('Minimize Maximize');
                if (maximizeNote != false) {

                    if ($(this).attr('data-window-size') == 1) {
                        $(".stickyNotesDiv" + note.id).hide();
                        $(".divSticky" + note.id + " > .ui-resizable-handle").hide();
                        $(".divSticky" + note.id).height('32px');

                        //$(this).html("<i class='fa fa-window-maximize'></i>");
                        $(this).removeClass('minimize_sticky_notes');
                        $(this).addClass('maximize_sticky_notes');

                        $(this).attr('title', 'Maximize');
                        $(this).attr('data-window-size', '0')
                    } else {
                        $(".stickyNotesDiv" + note.id).show();
                        $(".divSticky" + note.id + " > .ui-resizable-handle").show();
                        $(".divSticky" + note.id).height('300px');

                        // $(this).html("<i class='fa fa-window-minimize'></i>");
                        $(this).removeClass('maximize_sticky_notes');
                        $(this).addClass('minimize_sticky_notes');
                        $(this).attr('title', 'Minimize');
                        $(this).attr('data-window-size', '1')
                    }
                }
            });
            //End of Minimize Maximize function here!


            // Show Hide function here!
            if (note.settings.show == 'show') {
                var showHideStickyNotes = $("<div class='show_hide_notes hide_sticky fa fa-eye' data-option='hide' title='Hide'></div>");
            } else {
                var showHideStickyNotes = $("<div class='show_hide_notes show_sticky fa fa-eye'  data-option='show' title='Show'></div>");
            }
            showHideStickyNotes.click(function () {
                if (sleeping(noteBox)) {
                    return;
                }
                showNote = note.settings.onNoteBoxShowHide(note, noteBox, $(this).attr('data-option'));

                //console.log('Show Hide');
                //console.log(noteBox);
                if (showNote != false) {
                    if ($(this).attr('data-option') == 'hide') {
                        //   $(this).html("<i class='fa fa-eye-slash'></i>");
                        $(this).removeClass("hide_sticky");
                        $(this).addClass("show_sticky");
                        $(this).attr('title', 'show');
                        $(this).attr('data-option', 'show');
                        $(".divSticky" + note.id).hide();
                    } else {
                        //$(this).html("<i class='fa fa-eye'></i>");
                        $(this).removeClass("show_sticky");
                        $(this).addClass("hide_sticky");
                        $(this).attr('title', 'Hide');
                        $(this).attr('data-option', 'hide');
                        $(".divSticky" + note.id).show();
                    }
                }
            });


            //End of Show Hide function here!


            // Settings menu
            var noteBoxOptions = {};
            if (note.settings.availableThemes.length != null && note.settings.availableThemes.length > 0
                && note.settings.availableThemes[0] != null) {

                noteBoxOptions = $("<div title='Change Color' class='" + optionsCssClass + "'>"
                    + note.settings.optionsLinkText + "</div>");

                var noteBoxOptionsControl = $("<div class='" + optionsControlCssClass + "'>"
                    + note.settings.optionsLinkText + "</div>");
                noteBoxOptions.append(noteBoxOptionsControl);

                noteBoxOptionsControl.click(function (e) {
                    if (sleeping(noteBox)) {
                        return;
                    }
                    alreadyThere = false;

                    noteBoxOptions.find("." + themeBoxCssClass).each(function () {
                        alreadyThere = true;
                        $(this).remove();
                    });
                    if (alreadyThere) {
                        return;
                    }
                    $element.find("." + themeBoxCssClass).each(function () {
                        $(this).remove();
                    });

                    var noteBoxThemeOptions = $("<div class='" + themeBoxCssClass + "'></div>");
                    var noteBoxThemeSelect = $("<select></select>");
                    var themeSelectOptions = "";
                    for (var i = 0; i < note.settings.availableThemes.length; i++) {
                        themeSelectOptions += "<option value='"
                            + note.settings.availableThemes[i].value
                            + "'>" + note.settings.availableThemes[i].text + "</option>";
                        console.log(note.settings.availableThemes[i].value);
                    }
                    noteBoxThemeSelect.append(themeSelectOptions);
                    noteBoxOptions.append(noteBoxThemeOptions.append(noteBoxThemeSelect));
                    noteBoxThemeSelect.val(note.settings.defaultTheme.value);
                    noteBoxThemeSelect.focus();
                    setOptionsCss(noteBoxThemeOptions);

                    noteBoxThemeSelect.change(function () {
                        if (sleeping(noteBox)) {
                            return;
                        }
                        noteBox.removeClass(note.settings.defaultTheme.value);
                        note.settings.defaultTheme.value = $(this).val();
                        note.settings.defaultTheme.text = $("option:selected", $(this)).text();
                        note.settings.onThemeSelectionChange(note, noteBox);
                       // noteBox.removeAttr("class");
                        noteBox.addClass(outerCssClass + " " + $(this).val());
                        e.stopPropagation();
                    });

                    noteBoxThemeSelect.blur(function (evt) {
                        if (sleeping(noteBox)) {
                            return;
                        }
                        $(this).parent().remove();
                        evt.stopPropagation();
                    });

                    e.stopPropagation();
                });
            }

            // Let's combine elements together
            noteBox.append(noteBoxDelete).append(noteBoxMinimize).append(showHideStickyNotes).append(noteBoxOptions).append(noteBoxHeader).append(noteBoxTextContainer);


            // If user wants to perform some operation before creating a note box!
            if (existingNote == null) {
                createNote = note.settings.beforeCreatingNoteBox(note, noteBox);
                // User said, not to create new note!
                if (createNote == false) {
                    return;
                }
            }

            $('#kt_body').append(noteBox);

            // Let the note view area cover available height
            var heightAvail = heightAvailableForNoteText(noteBox, noteBoxHeader);
            //console.log(heightAvail);

            if (heightAvail > 0) {
                noteBoxTextContainer.height(heightAvail + "px");
            }

            // Let user move the note, where they want!
            noteBox.draggable({
                scroll: false,
                containment: "window",
                start: function (event, ui) {
                    updateZIndexForNoteBox(this, note);
                },
                stop: function (event, ui) {

                    // Update attached coaStickyNote data
                    ui.helper.data(dataKey).settings.notePosition.left = ui.position.left + "px";
                    ui.helper.data(dataKey).settings.notePosition.top = ui.position.top + "px";

                    // User may want to do some thing more!
                    note.settings.onNoteBoxDraggingStop(note, noteBox);
                }
            });

            // Let user deicde the size of the the note box
            if (note.settings.resizable) {
                noteBox.resizable({
                    alsoResize: noteBoxTextContainer,
                    minHeight: 100,
                    minWidth: 200,
                    stop: function (event, ui) {

                        // Update attached coaStickyNote data
                        ui.helper.data(dataKey).settings.notePosition.left = ui.position.left + "px";
                        ui.helper.data(dataKey).settings.notePosition.top = ui.position.top + "px";
                        ui.helper.data(dataKey).settings.noteDimension.width = ui.size.width + "px";
                        ui.helper.data(dataKey).settings.noteDimension.height = ui.size.height + "px";

                        // User may want to do some thing more!
                        note.settings.onNoteBoxResizeStop(note, noteBox);
                    }
                });
            }

            if (note.settings.maximize == 1) {
                $(".divSticky" + note.id + " > .ui-resizable-handle").show();
            } else {
                $(".divSticky" + note.id + " > .ui-resizable-handle").hide();
            }

            // If user wants to perform some operation after creating a new note box!
            if (existingNote == null) {
                note.settings.onNoteBoxCreated(note, noteBox);
            }

            noteBox.data(dataKey, note);
            if (existingNote == null) {
                $('html, body').animate({
                    scrollTop: $(".divSticky" + note.id).offset().top
                }, 1000);
                //stickyNotesDiv1
            }
        };
        plugin.init();
    };

    var empty = function () {
    };

    $.fn.coaStickyNote = function (options) {

        return this.each(function () {
            if (undefined == $(this).data('coaStickyNote')) {
                var plugin = new $.CoaStickyNote(this, options);
                $(this).data('coaStickyNote', plugin);
            }
        });
    };
});
