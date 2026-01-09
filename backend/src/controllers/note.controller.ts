import * as noteService from "../services/note.service";

export async function createNote(req, res) {
  try {
    const { title,description } = req.body;

    const result = await noteService.createNote(title, description);
    res.status(200).json({
      success: true,
      message: "Note Created",
      note: result.note,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}
export async function updateNote(req, res) {
  try {
    const { id, title, description } = req.body;
    const updatedNote = { id, title, description };
    console.log("updatedNote-",updatedNote)
    await noteService.updateNote(updatedNote);
    res.status(200).json({
      success: true,
      message: "Note Updated"
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}
export async function deleteNote(req, res) {
  try {
    const { id } = req.params;

    await noteService.deleteNote(id);
    res.status(200).json({
      success: true,
      message: "Note Deleted"
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}
export async function getAll(req, res) {
  try {

    const result = await noteService.getAll();
    res.status(200).json({
      success: true,
      message: "Get All Note",
      note: result.note,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}
export async function getById(req, res) { 
  try {
    const id  = req.params.id;
    console.log("req-",req.params)

    const result = await noteService.getById(id);
    res.status(200).json({
      success: true,
      message: "Note Get By ID",
      note: result.note,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}
