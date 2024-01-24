import { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SAVE_INTERVAL_MS = 2000;
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

export default function TextEditor() {
  const { id: documentId } = useParams();
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const [newDocumentId, setNewDocumentId] = useState("");
  const navigate = useNavigate();

  const callAboutPage = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/about`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
        credentials: "include",
      });
      const data = await res.data;
      console.log(data);
    } catch (err) {
      if (err) {
        // Use navigate to redirect to the login page
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    callAboutPage();
  }, []);

  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });

    socket.emit("get-document", documentId);
  }, [socket, quill, documentId]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta) => {
      quill.updateContents(delta);
    };
    socket.on("receive-changes", handler);

    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };
    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  const handleNewDocumentIdChange = (e) => {
    setNewDocumentId(e.target.value);
  };

  const handleNavigateToDocument = () => {
    const encodedDocumentId = encodeURIComponent(newDocumentId);
    navigate(`/documents/${encodedDocumentId}`);
  };

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    q.disable();
    q.setText("Loading...");
    setQuill(q);
  }, []);

  return (
    <>
      <nav className="navbar navbar-dark bg-dark">
        <Link to="/">
          <button className="btn btn-primary ">
            Home
          </button>
        </Link>
        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
          Collab Id
        </button>
        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newDocumentModal">
          Join Collaboratory
        </button>
      </nav>

      {/* Existing Modal */}
      <section className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title" id="exampleModalLabel">Collab Id</h3>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <strong>Your Id is: </strong>{documentId}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </section>

      {/* New Modal for User Input */}
      <section className="modal fade" id="newDocumentModal" tabIndex="-1" aria-labelledby="newDocumentModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title" id="newDocumentModalLabel">Enter Collaboratory ID</h3>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <label htmlFor="newDocumentId" className="form-label">Collaboratory ID:</label>
              <input
                type="text"
                className="form-control"
                id="newDocumentId"
                value={newDocumentId}
                onChange={handleNewDocumentIdChange}
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={handleNavigateToDocument}>Go to Collaboratory</button>
            </div>
          </div>
        </div>
      </section>

      <div className="container" ref={wrapperRef}></div>
    </>
  );
}
