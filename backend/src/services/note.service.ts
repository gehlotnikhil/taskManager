import prisma from "../lib/prisma";

interface Note {
    id?: string;
    title?: string
    description?:string
}

export async function createNote(title, description) {
  
        
    const result = await prisma.note.create({
        data:{
            title,
            description
        }
    })
    return {
        note:result
    }
  
}
export async function updateNote(updatedNote:Note) {
    const id = updatedNote.id
    const title = updatedNote.title
    const description = updatedNote.description
    console.log("hi")
    console.log("updateNote-",updatedNote)
    
    await prisma.note.update({
        data:{
            title,
            description
        },
        where:{id:id}
    })
}
export async function deleteNote(id) {
     await prisma.note.delete({
        where:{id:id}
    })
}
export async function getAll() {
    const result = await prisma.note.findMany({})
    return {note:result}
}
export async function getById(id) {
    console.log(id)
    const result = await prisma.note.findFirst({where:{id:id}})
    return {note:result}
}

