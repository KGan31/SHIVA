import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../globalStyles";
// import { useAnalysisContext } from "../Datacontext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  coy,
  dark,
  okaidia,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import * as S from "./CodegenStyles";

const Codegen = () => {
  const [activeTab, setActiveTab] = useState(1);
//   const { analysisResults, setResults, setFetching } = useAnalysisContext();
//   const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    prompt: "",
    database_schema: "",
    template: "",
  });
  const [analysisResults, setAnalysisResults] = useState({
    code: "",
    pseudocode: "",
  });

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setFetching(true);
    // setLoading(true);

    try {
        const response = await fetch("http://localhost:5000/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
  
        });
  
        if (!response.ok) {
           console.log(formData);
          throw new Error("Failed to analyze the essay");
        }
  
        try {
          const analysisResults = await response.json();
          setAnalysisResults(analysisResults);
        //   setResults(analysisResults);
          console.log(analysisResults);
        } catch (error) {
          console.error("Failed to parse response JSON", error);
        }
      } catch (error) {
        console.error(error);
      } finally {
        // setFetching(false);
        // setLoading(false);
      }
    };

  return (
    <S.Container>
      <S.SideMenu>
        <S.Tabs>
        <S.ButtonWrapper2>
          <S.Button
            onClick={() => handleTabClick(1)}
            className={activeTab === 1 ? "active" : ""}
          >
            Text Prompt
          </S.Button>

          <S.Button
            onClick={() => handleTabClick(2)}
            className={activeTab === 2 ? "active" : ""}
          >
            Database Schema
          </S.Button>

          <S.Button
            onClick={() => handleTabClick(3)}
            className={activeTab === 3 ? "active" : ""}
          >
            Template
          </S.Button>
          </S.ButtonWrapper2>
          
        </S.Tabs>
        <S.Section>
          <S.TextBox
            className="section1"
            title="Text Prompt"
            name="prompt"
            value={formData.prompt}
            onChange={handleChange}
            placeholder="prompt"
            $active={activeTab === 1}
          >
            <S.Header>Text Prompt</S.Header>
            <textarea
              name="prompt"
              value={formData.prompt} // Ensure that the value is bound to formData.prompt
              placeholder="prompt"
              onChange={handleChange}
            />
          </S.TextBox>
          <S.TextBox
            title="Database Schema"
            name="database_schema"
            value={formData.database_schema}
            onChange={handleChange}
            placeholder="database schema"
            $active={activeTab === 2}
          >
            <S.Header>Database Schema</S.Header>
            <textarea
              name="database_schema"
              value={formData.database_schema}
              placeholder="database schema"
              onChange={handleChange}
            />
          </S.TextBox>
          <S.TextBox
            title="Template"
            name="template"
            value={formData.template}
            placeholder="template"
            onChange={handleChange}
            $active={activeTab === 3}
          >
            <S.Header>Template</S.Header>
            <textarea
              name="template"
              value={formData.template}
              placeholder="template"
              onChange={handleChange}
            />
          </S.TextBox>
          <S.ButtonWrapper>
          <S.ButtonS onClick={handleSubmit}>Generate Code</S.ButtonS>
          </S.ButtonWrapper>
          
        </S.Section>
      </S.SideMenu>
      <S.AiSection>
        <br />
        <br />
        {/* {loading ? (
          // Show a loading state while fetching data
          <>
            <S.AiTextBox
              title="Code"
              content={
                <SyntaxHighlighter language="python" style={okaidia}>
                  {"Generating..."}
                </SyntaxHighlighter>
              }
            />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <S.AiTextBox2
              title="Pseudocode"
              content={
                <SyntaxHighlighter language="markdown" style={coy}>
                  {"Generating..."}
                </SyntaxHighlighter>
              }
            />
          </>
        ) : (
          // Render AiTextBox components when data is available
          <> */}
            <AiTextBox
              title="Code"
              content={
                <SyntaxHighlighter language="python" style={okaidia}>
                  {analysisResults.code}
                </SyntaxHighlighter>
              }
            />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <AiTextBox2
              title="Pseudocode"
              content={
                <SyntaxHighlighter language="markdown" style={coy}>
                  {analysisResults.pseudocode}
                </SyntaxHighlighter>
              }
            />
          {/* </> */}
        {/* )} */}
      </S.AiSection>
    </S.Container>
  );
};

const AiTextBox = ({ title, content }) => {
    return (
      <div style={{
        background: '#242424',
        boxShadow: '0 6px 20px rgba(56, 125, 255, 0.2)',
        width: '70%',
        textDecoration: 'none',
        borderRadius: '4px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
        color: '#fff',
        marginTop: '50px',
        marginBottom: '-150px',
        color: 'black'
      }}>
        <h2 style={{ marginBottom: '10px', color: '#3498db' }}>{title}</h2>
        <div className="ai-content" style={{ width: '100%', maxWidth: '100%', overflow: 'auto', height: '200px', wordBreak: 'break-word' }}>
          <pre>{content}</pre>
        </div>
      </div>
    );
  };

  const AiTextBox2 = ({ title, content }) => {
    return (
      <div style={{
        background: '#242424',
        boxShadow: '0 6px 20px rgba(56, 125, 255, 0.2)',
        width: '70%',
        textDecoration: 'none',
        borderRadius: '4px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
        color: '#fff',
        marginTop: '50px',
        marginBottom: '-150px',
        color: 'black'
      }}>
        <h2 style={{ marginBottom: '10px', color: '#3498db' }}>{title}</h2>
        <div className="ai-content" style={{ width: '100%', maxWidth: '100%', overflow: 'auto', height: '200px', wordBreak: 'break-word' }}>
          <pre>{content}</pre>
        </div>
      </div>
    );
  };
  
  

export default Codegen;
