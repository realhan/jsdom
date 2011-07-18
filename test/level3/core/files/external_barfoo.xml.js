/*<?xml version="1.0" encoding="UTF-8"?>

<html xmlns='http://www.w3.org/1999/xhtml'>
<head>
<title>external entity encoding sample</title>
</head>
<body onload="parent.loadComplete()">
<p>bar&ent2;&ent1;</p>
<p xml:base="http://www.example.com/bogus_base">bar&ent2;&ent1;</p>
&ent3;
</body>
</html>*/


var dom = require('../../../../lib/jsdom/level3/core').dom.level3.core;

module.exports.external_barfoo =  function () {

  var doc = new dom.Document("html");
  doc._inputEncoding = 'UTF-8';
  doc._xmlEncoding = 'UTF-8';
  doc._baseURI = 'file://' + __dirname;
  doc._documentURI = doc._baseURI;

  /*
  <!DOCTYPE html [
  <!ENTITY ent1 SYSTEM 'external_foo.ent'>
  <!ENTITY ent2 SYSTEM 'external_foobr.ent'>
  <!ENTITY ent3 SYSTEM 'external_widget.ent'>
  <!ENTITY ent5 PUBLIC "entityURI" "entityFile" NDATA notation1>
  <!ELEMENT html (head, body)>
  <!ATTLIST html xmlns CDATA #IMPLIED>
  <!ELEMENT head (title,script*)>
  <!ELEMENT title (#PCDATA)>
  <!ELEMENT script (#PCDATA)>
  <!ATTLIST script
       src CDATA #IMPLIED
       type CDATA #IMPLIED
       charset CDATA #IMPLIED>
  <!ELEMENT body (p*)>
  <!ATTLIST body onload CDATA #IMPLIED>
  <!ELEMENT p (#PCDATA|br)*>
  <!ATTLIST p xml:base CDATA #IMPLIED
              xmlns CDATA #IMPLIED>
  <!ELEMENT br EMPTY>
  <!NOTATION notation1 PUBLIC "notation1File">
  ]>*/


  //<!ENTITY ent1 'foo'>
  var ent1 = doc.createEntityNode('ent1', doc.createTextNode('foo'));

  //<!ENTITY ent2 'foo<br/>'>
  var ent2Element = doc.createElement('ent2');
  ent2Element.appendChild(doc.createTextNode("foo"));
  ent2Element.appendChild(doc.createElement('br'));

  var entities = new dom.EntityNodeMap(
    doc,
    ent1,
    ent2Element
  );

  /*
   <!ATTLIST p
      dir CDATA 'rtl'
      xmlns:dmstc CDATA #IMPLIED
      xmlns:nm CDATA #IMPLIED
      xmlns:emp2 CDATA #IMPLIED>
  */
  var defaultsAttributes = new dom.NamedNodeMap(doc);
  var defaultP = doc.createElement('p');
  defaultP.setAttribute('dir', 'rtl');
  defaultsAttributes.setNamedItem(defaultP);

  // <!DOCTYPE html [
  var docType = new dom.DocumentType(
    doc,
    'xml',
    entities,
    new dom.NotationNodeMap(doc),
    defaultsAttributes
  );

  doc.doctype = docType;

  doc.implementation =  new dom.DOMImplementation(doc, {
    "XML" : ["1.0", "2.0"],
    "core": ["1.0", "2.0", "3.0"]
  });

  // <html xmlns='http://www.w3.org/1999/xhtml'>
  var xmlns = 'http://www.w3.org/1999/xhtml';
  var html      = doc.createElementNS(xmlns,"html");

  //<head>
  var head = doc.createElementNS(xmlns, 'head');
  //<title>replaceWholeText sample</title>
  var title = doc.createElementNS(xmlns, 'title');
  title.appendChild(doc.createTextNode('replaceWholeText sample'))
  head.appendChild(title);
  //</head>
  html.appendChild(head);

  //<body onload="parent.loadComplete()">
  var body = doc.createElementNS(xmlns, 'body');
  body.setAttribute('onload', 'parent.loadComplete()');

  //<p>bar</p>
  var p = doc.createElementNS(xmlns, 'p');
  p.appendChild(doc.createTextNode('bar'));
  body.appendChild(p);

  //</body>
  html.appendChild(body);

  //</html>
  doc.appendChild(html);

  return doc;
};
