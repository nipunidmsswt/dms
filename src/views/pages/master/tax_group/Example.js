import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Formik, Form, ErrorMessage } from "formik";
import { useDropzone } from "react-dropzone";
import * as Yup from "yup";

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16
};

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #000",
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: "border-box"
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden"
};

const img = {
  display: "block",
  width: "auto",
  height: "100%"
};

function Previews(props) {
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      acceptedFiles.map((file, index) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          acceptedFiles[index].base64 = event.target.result;
        };
        reader.onerror = (error) => {
          // Handle error here
        };
        reader.readAsDataURL(file);
      });

      props.setFieldValue("avatars", [...props.avatars, ...acceptedFiles]);
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
    }
  });

  const thumbs = files.map((file) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img src={file.preview} style={img} />
      </div>
    </div>
  ));

  useEffect(
    () => () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <section className="container">
      <div
        {...getRootProps()}
        style={{ border: "1px solid #000", padding: "1rem" }}
      >
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside style={thumbsContainer}>{thumbs}</aside>
    </section>
  );
}

const Demo = () => {
  return (
    <Formik
      initialValues={{
        avatars: []
      }}
      validationSchema={Yup.object().shape({
        avatars: Yup.array().min(1).required()
      })}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <Previews setFieldValue={setFieldValue} avatars={values.avatars} />
          <ErrorMessage style={{ color: "red" }} component="p" name="avatars" />
          <button type="submit">Upload</button>
        </Form>
      )}
    </Formik>
  );
};

ReactDOM.render(<Demo />, document.getElementById("container"));
