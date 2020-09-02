import React, { Component } from 'react';
import './App.css';
import SideBarComponent from "./sidebar/sidebar";
import EditorComponent from "./editor/editor"

const firebase = require("firebase");

class App extends Component {
  constructor(){
    super();
    this.state = {
      selectedNoteIndex: null,
      selectedNote: null,
      notes:null
    }
  }

  render() {
    return (
      <div className="app-container">
        <SideBarComponent  
          selectedNoteIndex={this.state.selectedNoteIndex}
          notes={this.state.notes}
          deleteNote={this.deleteNote}
          selectNote={this.selectNote}
          newNote={this.newNote}>
        </SideBarComponent>
        {
          this.state.selectedNote? 
          <EditorComponent selectedNote={this.state.selectedNote}
          selectedNoteIndex={this.state.selectedNoteIndex}
          notes={this.state.notes}
          noteUpdate={this.noteUpdate}></EditorComponent>:null
        }
        
      </div>
    );
  }

  componentDidMount = () => {
    // whatever function is passed into onsnapshot gets called anytime bound
    // collection is updated
    firebase.firestore().collection("notes").onSnapshot(serverUpdate =>{
      const notes = serverUpdate.docs.map(_doc => {
        const data = _doc.data();
        data["id"] = _doc.id;
        return data;
      });
      this.setState({notes:notes})
    });
  }

  selectNote = (note, index) =>{
    this.setState({selectedNoteIndex:index, selectedNote:note});
  }

  noteUpdate = (id, noteObj) => {
    firebase.firestore().collection("notes").doc(id)
    .update({title:noteObj.title, body:noteObj.body, timestamp:firebase.firestore.FieldValue.serverTimestamp()})
  }

  newNote = async (title) => {
    const note = {
      title: title,
      body: ""
    };
    const newFromDB = await firebase.firestore().collection("notes").add({
      title:note.title,
      body:note.body,
      timestamp:firebase.firestore.FieldValue.serverTimestamp()

    });
    const newID = newFromDB.id;
    await this.setState({notes:[...this.state.notes, note]});
    const newNoteIndex = this.state.notes.indexOf(this.state.notes.filter(_note=>_note.id ===newID)[0]);
    this.setState({selectedNote: this.state.notes[newNoteIndex], selectedNoteIndex:newNoteIndex});
  }

  deleteNote = async (note) => {
    const noteIndex = this.state.notes.indexOf(note);
    await this.setState({notes:this.state.notes.filter(_note=>_note !==note)})
    if(this.state.selectedNoteIndex === noteIndex){
      this.setState({selectedNoteIndex:null, selectNote:null});
    }
    else {
      this.state.notes.length > 1 ?
      this.selectNote(this.state.notes[this.state.selectedNoteIndex - 1], this.state.selectedNoteIndex - 1):
      this.setState({selectedNoteIndex:null, selectNote:null});
    }
    firebase.firestore().collection("notes").doc(note.id).delete();
  }

}

export default App;