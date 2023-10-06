/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable max-len */
/* eslint-disable indent */
const {nanoid} = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
    const {title, tags, body} = request.payload;

    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updateAt = createdAt;

    const newNote = {
        title, tags, body, id, createdAt, updateAt,
    };

    notes.push(newNote);

    const isSuccess = notes.filter((note) => note.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Success Add Note',
            data: {
                noteId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Failed Add Note',
    });
    response.code(500);
    return response;
};

const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    },
});

const getNoteByIdHandler = (request, h) => {
    const {id} = request.params;

    const note = notes.filter((n) => n.id === id)[0];

    if (note !== undefined) {
        return {
            status: 'success',
            data: {
                note,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Note is Not Found',
    });
    response.code(404);
    return response;
};

const editNoteByIdHandler = (request, h) => {
    const {id} = request.params;

    const {title, tags, body} = request.payload;
    const updateAt = new Date().toISOString();

    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updateAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Note Success Updated',
        });
        response.code(200);
        return response;
    } 
};

const deleteNoteByIdHandler = (request, h) => {
    const {id} = request.params;

    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Deleted Note Success',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'ID Not Found. Failed Deleted Note',
    });
    response.code(404);
    return response;
};

module.exports = {
    addNoteHandler, 
    getAllNotesHandler, 
    getNoteByIdHandler, 
    editNoteByIdHandler,
    deleteNoteByIdHandler,
};
