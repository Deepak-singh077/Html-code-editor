import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import EditorNav from '../components/EditiorNav';
import { MdLightMode } from 'react-icons/md';
import { FaExpandAlt } from 'react-icons/fa';
import { api_base_url } from '../helper';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
const CodeEditor = () => {
  const [tab, setTab] = useState("html");
  const [isLightMode, setIsLightMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [htmlCode, setHtmlCode] = useState("<h1>Hello World</h1>");
  const [cssCode, setCssCode] = useState("body{ color:blue;}");
  const [jsCode, setJsCode] = useState("");
  
  let {projectID} = useParams();


  const changeTheme = () => {
    setIsLightMode(prevMode => !prevMode);
  };
  const toggleExpand = () => {
    setIsExpanded(prevExpanded => !prevExpanded);
  };
  const run = () => {
    const iframe = document.getElementById("iframe");
    iframe.srcdoc = `
      <html>
        <head>
          <style>
            ${cssCode}
          </style>
        </head>
        <body>
          ${htmlCode}
          <script>
            ${jsCode}
          </script>
        </body>
      </html>
    `;
  };
  useEffect(() => {
    run();
  }, [htmlCode, cssCode, jsCode]);
  
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    fetch(`${apiUrl}/getProject`, {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        projId: projectID
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.project) {
          setHtmlCode(data.project.htmlCode || "<h1>Hello World</h1>");  // Default value in case it's null/undefined
          setCssCode(data.project.cssCode || "body { color: blue; }");
          setJsCode(data.project.jsCode || "");
        } else {
          console.error("Error:", data.message || "Project not found");
          setHtmlCode("<h1>Project not found</h1>"); // Show this in the editor if no project is found
          setCssCode("body { color: red; }");
          setJsCode("");
        }
      })
      .catch(error => {
        console.error("Fetch error:", error);
      });
  }, [projectID]);
  
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        const apiUrl = import.meta.env.VITE_API_URL;
        fetch(`${apiUrl}/updateProject`, {
          mode: "cors",
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: localStorage.getItem("userId"),
            projId: projectID,
            htmlCode: htmlCode,
            cssCode: cssCode,
            jsCode: jsCode
          })
        })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            toast.success("Project saved successfully");
          } else {
            console.error("Error saving project:", data.message);
            toast.error("Something went wrong");
          }
        })
        .catch(error => {
          console.error("Fetch error:", error);
          toast.error("Network error while saving project");
        });
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [htmlCode, cssCode, jsCode, projectID]); // Added states to dependency array
  
  return (
    <div className='text-white'>
      <EditorNav />
      <div className='flex'>
        <div className={`left ${isExpanded ? 'w-full' : 'w-[50%]'}`}>
          <div className='flex items-center justify-between gap-2 w-full bg-[#1A1919] h-[50px] px-[40px]'>
            <div className='flex items-center gap-2'>
              <div onClick={() => setTab("html")} className='cursor-pointer p-2 px-[10px] text-[15px]'>HTML</div>
              <div onClick={() => setTab("css")} className='cursor-pointer p-2 px-[10px] text-[15px]'>CSS</div>
              <div onClick={() => setTab("js")} className='cursor-pointer p-2 px-[10px] text-[15px]'>JAVASCRIPT</div>
            </div>

            <div className='flex items-center gap-2'>
              <i className='pr-4 cursor-pointer' onClick={changeTheme}><MdLightMode /></i>
              <i className='expand cursor-pointer' onClick={toggleExpand}><FaExpandAlt /></i>
            </div>
          </div>

          {tab === "html" ? (
            <Editor 
              onChange={(e) => {setHtmlCode(e); run();}} 
              height="80vh" 
              theme={isLightMode ? "vs-light" : "vs-dark"} 
              language="html" 
              value={htmlCode} 
            />
          ) : tab === "css" ? (
            <Editor 
              onChange={(e) => {setCssCode(e); run();}} 
              height="80vh" 
              theme={isLightMode ? "vs-light" : "vs-dark"} 
              language="css" 
              value={cssCode} 
            />
          ) : (
            <Editor 
              onChange={(e) => {setJsCode(e); run();}} 
              height="80vh" 
              theme={isLightMode ? "vs-light" : "vs-dark"} 
              language="javascript" 
              value={jsCode} 
            />
          )}
        </div>
        
        {!isExpanded && <iframe id='iframe' className='w-[50%] min-h-[80vh] bg-white text-black' title='Preview'></iframe>}
      </div>
    </div>
  );
};

export default CodeEditor;
