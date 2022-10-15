$(function () {
    // Advanced demo
    $('#divStickyNotesContainer').coaStickyNote({
        resizable: true,
        availableThemes: [
            {text: "Yellow", value: "sticky-note-yellow-theme"},
            {text: "Green", value: "sticky-note-green-theme"},
            {text: "Blue", value: "sticky-note-blue-theme"},
            {text: "Pink", value: "sticky-note-pink-theme"},
            {text: "Orange", value: "sticky-note-orange-theme"}],
        notePosition: {top: "150px", left: "300px"},
        noteDimension: {width: "300px", height: "300px"},
        noteText: "New custom note box!",
        noteHeaderText: "Note title!",
        deleteLinkText: "<i class='fa fa-trash'></i>",
        startZIndex: 50,
        maximize: 1,
        show: 'show',
        beforeCreatingNoteBox: function (note) {
            // Want to do any thing here?
        },
        onNoteBoxCreated: function (note) {

            // Let's save it on server
            getBackEndStickyObjectTemp = getBackEndStickyObject(note);
            if ($('#fLMRId').length > 0) {
                getBackEndStickyObjectTemp.LMRID = $('#fLMRId').val();
            }
            if ($('#FPCID').length > 0) {
                getBackEndStickyObjectTemp.PCID = $('#FPCID').val();
            }

            $.ajax({
                url: '../pops/ajaxAddStickyNote.php',
                data: getBackEndStickyObjectTemp,
                type: 'POST',
                success: function (data) {
                    data = $.parseJSON(data);
                    // Set the id of this note, id from the server db/ any storage place.
                    // This id can help in deleting/ updating the note on server if requested by user.
                    note.id = data.ItemId;
                    ajaxnoteId = data.ItemId
                    tempNoteId = 1;
                    $(".stickyNotesDiv" + tempNoteId).addClass("stickyNotesDiv" + ajaxnoteId);
                    $(".stickyNotesDiv" + ajaxnoteId).removeClass("stickyNotesDiv" + tempNoteId);


                    $(".divSticky" + tempNoteId).addClass("divSticky" + ajaxnoteId);
                    $(".divSticky" + ajaxnoteId).removeClass("divSticky" + tempNoteId);


                    $(".sticktNotesIdHeader" + tempNoteId).addClass("sticktNotesIdHeader" + ajaxnoteId);
                    $(".sticktNotesIdHeader" + ajaxnoteId).removeClass("sticktNotesIdHeader" + tempNoteId);

                },
                error: function (result) {
                }
            });

        },
        onNoteBoxHeaderUpdate: function (note) {
            // Return false, if want to abort the request of header update.
            // Else let's save the updated header text on server, to preserve changes.
            return updateStickyNote(note);
        },
        onNoteBoxTextUpdate: function (note) {
            // We can also show confirm box here. Which is common while deleting some thing!
            // Return false, if want to abort the request of text update.
            // Else let's save the updated note text on server, to preserve changes.
            return updateStickyNote(note);
        },
        onNoteBoxDelete: function (note) {
            // Return false, if want to abort the note delete request .
            // Else let's delete the note details from server, to preserve changes.
            return deleteStickyNote(note);
        },
        onNoteBoxMinimize: function (note, notebox, winSize) {
            // Return false, if want to abort the note delete request .
            // Else let's delete the note details from server, to preserve changes.
            return minimizeStickyNote(note, winSize);
        },
        onNoteBoxShowHide: function (note, notebox, opt) {
            // Return false, if want to abort the note delete request .
            // Else let's delete the note details from server, to preserve changes.
            return showHideStickyNote(note, opt);
        },
        onNoteBoxResizeStop: function (note) {
            // Note box dimension got changed.
            // let's save the updated dimension(width/ height) on server, to preserve changes.
            return updateStickyNote(note);
        },
        onNoteBoxDraggingStop: function (note) {
            // Note box position got changed.
            // let's save the updated position(top/ left) on server, to preserve changes.
            return updateStickyNote(note);
        },
        onThemeSelectionChange: function (note) {
            // Note box theme got changed.
            // let's save the updated theme on server, to preserve changes.
            return updateStickyNote(note);
        },
        onMovingNoteBoxOnTop: function (note) {
            // Note box z-index got changed to be on top of all the notes.
            // let's save the updated the z-index on server, to preserve changes.
            return updateStickyNote(note);
        },
    });

    function getBackEndStickyObject(localObj) {
        return {
            Title: localObj.settings.noteHeaderText,
            NoteText: localObj.settings.noteText,
            PositionTop: localObj.settings.notePosition.top,
            PositionLeft: localObj.settings.notePosition.left,
            DimensionWidth: localObj.settings.noteDimension.width,
            DimensionHeight: localObj.settings.noteDimension.height,
            ZIndex: localObj.settings.zIndex,
            OuterCssClass: localObj.settings.defaultTheme.value,
            id: localObj.id,
            maximize: localObj.settings.maximize,
            show: localObj.settings.show,
        };
    }

    function getLocalStickyNoteObject(backEndObj, note) {
        if (note == null) {
            note = {};
            note.settings = {};
            note.settings.notePosition = {};
            note.settings.defaultTheme = {};
            note.settings.noteDimension = {};
        }

        note.settings.noteHeaderText = backEndObj.Title;
        note.settings.noteText = backEndObj.NoteText;
        note.settings.notePosition.top = backEndObj.PositionTop;
        note.settings.notePosition.left = backEndObj.PositionLeft;
        note.settings.noteDimension.width = backEndObj.DimensionWidth;
        note.settings.noteDimension.height = backEndObj.DimensionHeight;
        note.settings.zIndex = backEndObj.ZIndex;
        note.settings.defaultTheme.value = backEndObj.OuterCssClass;
        note.id = backEndObj.id;
        note.settings.maximize = backEndObj.maximize;
        note.settings.show = backEndObj.show;

        return note;
    }

    function updateStickyNote(note) {
        //console.log('updateStickyNote');
        //console.log(note);
        var backEndUpdateObject = getBackEndStickyObject(note);
        $.ajax({
            url: '../pops/ajaxUpdateStickyNote.php',
            data: backEndUpdateObject,
            type: 'POST',
            success: function (data) {
                data = $.parseJSON(data);
                note.id = data.ItemId;
                return true;
            },
            error: function (result) {
                return false;
            }
        });
        return true;
    }

    function deleteStickyNote(note) {

        if (confirm("Do You Want To Delete This Notes?") == true) {
            var backEndDeleteId = note.id;
            $.ajax({
                url: '../pops/ajaxDeleteStickyNote.php?id=' + backEndDeleteId,
                type: 'GET',
                success: function (data) {
                    data = $.parseJSON(data);
                    note.id = data.ItemId;
                    return true;
                },
                error: function (result) {
                    return false;
                }
            });
        } else {
            return false;
        }
    }

    function minimizeStickyNote(note, winSize) {
        var minMaxid = note.id;
        if (winSize == 1) {
            minimize = 0;
        } else {
            minimize = 1;
        }
        $.ajax({
            url: '../pops/ajaxMinMaxStickyNote.php?id=' + minMaxid + '&minimize=' + minimize,
            type: 'GET',
            success: function (data) {
                note.id = data.ItemId;
                return true;
            },
            error: function (result) {
                return false;
            }
        });
        return true;
    }

    function showHideStickyNote(note, opt) {
        var stickyId = note.id;
        $.ajax({
            url: '../pops/ajaxShowHideStickyNotes.php?id=' + stickyId + '&opt=' + opt,
            type: 'GET',
            success: function (data) {
                note.id = data.ItemId;
                return true;
            },
            error: function (result) {
                return false;
            }
        });
        return true;
    }


    function loadExistingNotes() {
        $("#divLoadingProgressGlobal").fadeIn();

        $.ajax({
            url: '../pops/ajaxFetchStickyNote.php',
            type: 'GET',
            success: function (data) {
                data = $.parseJSON(data);
                if (data != null && data.length > 0) {
                    var notes = [];
                    for (var counter = 0; counter < data.length; counter++) {
                        notes.push(getLocalStickyNoteObject(data[counter]));
                    }
                    $('#divStickyNotesContainer').data('coaStickyNote').loadExistingNotes(notes);
                }
                $("#divLoadingProgressGlobal").fadeOut();
            },
            error: function (result) {
                $("#divLoadingProgressGlobal").fadeOut();
            }
        });
    }

    //function getAllNotes() {
    //    var index = 1;
    //    var noteObject;
    //    var noteObjects = [];
    //    do {
    //        noteObject = $('#divStickyNotesContainer').data('coaStickyNote').getNoteBoxByIndex(index);
    //        if (noteObject != null) {
    //            noteObjects.push(noteObject);
    //        }
    //        index++;
    //    } while (noteObject != null)
    //    return noteObjects;
    //}

    //$(window).on('beforeunload', function () {
    //    var noteObjects = getAllNotes();

    //    // So, once we get all existing note boxes in an array, loop through the
    //    // array and get/set the required data
    //    // Above array will contain whole html object for each note, and from each note box,
    //    var notes = [];
    //    for (var i = 0; i < noteObjects.length; i++) {

    //        // Settings for each note needed for update!
    //        var note = noteObjects[i].data($('#divStickyNotesContainer').data('coaStickyNote').dataKey);

    //        // Now we will need the note textarea or note header textbox and get the
    //        // updated text and set to note setting object.
    //        var noteTextArea = noteObjects[i].find('div.each-sticky-note-text-box textarea');
    //        if (noteTextArea.length > 0) {
    //            note.settings.noteText = noteTextArea.val();
    //        }

    //        var noteHeaderBox = noteObjects[i].find('div.each-sticky-note-header input');
    //        if (noteHeaderBox.length > 0) {
    //            note.settings.noteHeaderText = noteTextArea.val();
    //        }
    //        notes.push(note);
    //    }

    //    // Now in notes array, you have all the updated notes.
    //    // Do ajax call, to update on server
    //});

    // Basic demo

    // Let's load existing notes with selected prefernces!

    //$('#loadExistingNoteButton').click(function () {
    loadExistingNotes();
    //});

    //   $('#loadExistingNoteButton').click(function () {
    // loadExistingNotes();
    //});

    $('.showAllStickyNotes').click(function () {

        $('.show_hide_notes').removeClass("show_sticky");
        $('.show_hide_notes').addClass("hide_sticky");
        $('.show_hide_notes').attr('title', 'hide');
        $('.show_hide_notes').attr('data-option', 'hide');


        $.ajax({
            url: '../pops/ajaxUpdateAllStickyNotes.php?opt=show',
            type: 'GET',
            success: function (data) {
                $('.each-sticky-note-outer').show();
            },
            error: function (result) {
                // $("#divLoadingProgressGlobal").fadeOut();
            }
        });


    });
    $('.hideAllStickyNotes').click(function () {

        $('.show_hide_notes').removeClass("hide_sticky");
        $('.show_hide_notes').addClass("show_sticky");
        $('.show_hide_notes').attr('title', 'show');
        $('.show_hide_notes').attr('data-option', 'show');

        $.ajax({
            url: '../pops/ajaxUpdateAllStickyNotes.php?opt=hide',
            type: 'GET',
            success: function (data) {
                $('.each-sticky-note-outer').fadeOut();
            },
            error: function (result) {
            }
        });
    });

    /*   setInterval(function () {
           loadExistingNotes();
       }, 5000);*/


    function destroyPlugin() {
        if (document.getElementById("basicDemo").checked) {
            $('#divStickyNotesContainerBasic').data('coaStickyNote').destroy();
        } else {
            $('#divStickyNotesContainer').data('coaStickyNote').destroy();
        }
    }

    $('body').on('click', '#destroyPlugin', (function () {
        destroyPlugin();
    }));

    $('body').on('change', 'input[name="demoType"]', (function () {
        window.location.href = "/Tool/StickyNoteDemo/" + $(this).attr("data-attr").toLowerCase();
    }));

    $('body').on('change', '#sleepAllMode', (function () {
        if (document.getElementById("advancedDemo").checked) {
            if (this.checked) {
                $('#divStickyNotesContainer').data('coaStickyNote').sleepAll();
            } else {
                $('#divStickyNotesContainer').data('coaStickyNote').wakeupAll();
            }
        } else if (document.getElementById("basicDemo").checked) {
            if (this.checked) {
                $('#divStickyNotesContainerBasic').data('coaStickyNote').sleepAll();
            } else {
                $('#divStickyNotesContainerBasic').data('coaStickyNote').wakeupAll();
            }
        }
    }));
});