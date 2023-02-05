<?xml version="1.0" encoding="UTF-8"?>
<!--
 $Id: LDDReport2html.xsl,v 1.13 2014/09/11 12:42:55 G. Greg Alvord and Leendert Bijnagte Exp $

	 Render an MISMO LDD file to a simple HTML presentation.

     This provides the basic mechanics so that users can embellish on this
     presentation for their own purposes.

     To enable an MISMO LDD file to be rendered in a browser,
     add the following processing instruction to the start of the file:

     <?xml-stylesheet type="text/xsl" href="LDDReport2html.xsl"?>

     When in a Windows interface, drag the LDD Report file from the Windows
     Explorer to Mozilla Firefox or Internet Explorer to engage the stylesheet
     presentation.

	 The LDD_Report.xml file is created by reading the Liason Contivo .comp file and 
	 extracting the relavent information on Data point terms and Container terms.  
	 The is done by the LDDFULLReport.xsl documented seperately. 

     When creating standalone HTML from the XML, two examples of using nxslt2.exe 
	 available from http://www.xmllab.net/Downloads/tabid/61/Default.aspx
     are as follows, the first explicitly referencing the stylesheet and the
     second looking for the embedded stylesheet association:

	Modify presentation of AcrRoles

	Merge depercated content presentations

       nxslt.exe LDD_Report.xml LDDReport2html.xsl -o LDDReport.html 


 Copyright (C) - MISMO
               - http://www.Mismo.org
 
 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:
 
 - Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.
 - Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.
 - The name of the author may not be used to endorse or promote products
   derived from this software without specific prior written permission.
 
 THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
 IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN
 NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 
 Note: for your reference, the above is the "Modified BSD license", this text
     was obtained 2003-07-26 at http://www.xfree86.org/3.3.6/COPYRIGHT2.html#5
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/TR/REC-html40" xmlns:mismo="http://www.mismo.org/residential/2009/LDD" xmlns:ldd="http://www.mismo.org/residential/2009/LDD" exclude-result-prefixes="mismo ldd" version="1.0">
	<xsl:output indent="yes" method="html"/>
	<xsl:variable name="maxRows" select="30"/>
	<xsl:variable name="mismo:listTitle">LDD:</xsl:variable>
	<xsl:variable name="mismo:badDocElemTitle">Unexpected XML document for stylesheet</xsl:variable>
	<xsl:variable name="mismo:listHeading">LDD</xsl:variable>
	<xsl:variable name="majorVersion" select="concat(substring-before(*/mismo:Identification/@ModelVersion,'.'),'.',substring-before(substring-after(*/mismo:Identification/@ModelVersion,'.'),'.'))"/>
	<xsl:variable name="minorVersion" select="substring-after(substring-after(*/mismo:Identification/@ModelVersion,'.'),'.')"/>
	<xsl:template name="mismo:badDocElem">
		<xsl:param name="ns"/>
		<p>Unexpected XML document for <samp>LDDReport2html.xsl</samp> stylesheet.</p>
		<p>The document element is expected to be named
			<samp>LDD</samp>in the
			<samp>
				<xsl:value-of select="$ns"/>
			</samp>namespace, otherwise this message is displayed.</p>
		<p>What was found in this document is the document element named
			<samp>
				<xsl:value-of select="name(.)"/>
			</samp>in the
			<samp>
				<xsl:value-of select="namespace-uri(.)"/>
			</samp>namespace.</p>
	</xsl:template>
	<xsl:template match="text()"/>
	<xsl:template match="/">
		<html>
			<head>
				<!--determine the text to put in the browser title bar-->
				<xsl:choose>
					<xsl:when test="mismo:LDD">
						<!--found what we are expecting-->
						<title>
							<xsl:copy-of select="$mismo:listTitle"/>
							<xsl:text>Version=</xsl:text>
							<xsl:value-of select="*/mismo:Identification/@Version"/>
							<xsl:text> Build=</xsl:text>
							<xsl:value-of select="*/mismo:Identification/@Build"/>
						</title>
					</xsl:when>
					<xsl:otherwise>
						<title>
							<xsl:copy-of select="$mismo:badDocElemTitle"/>
						</title>
					</xsl:otherwise>
				</xsl:choose>
			</head>
			<body>
				<xsl:apply-templates/>
				<p align="right">
					<small>
						<xsl:text/>Report created by <samp>LDDReport2html_wAppInfoNPPI.xsl</samp>
						<xsl:text> $Revision: 1.12 $ </xsl:text>
						<a href="http://www.mismo.org">
							<xsl:text>MISMO</xsl:text>
						</a>
					</small>
				</p>
			</body>
		</html>
	</xsl:template>
	<!--ooops ... the document element isn't what is expected-->
	<xsl:template match="/*">
		<xsl:call-template name="mismo:badDocElem">
			<xsl:with-param name="ns" select="string(document('')/*/namespace::mismo)"/>
		</xsl:call-template>
	</xsl:template>
	<!--========================================================================-->
	<!--the titling of the value list-->
	<xsl:template match="/mismo:LDD" priority="2">
		<h2>
			<a name="{generate-id(.)}">
				<xsl:copy-of select="$mismo:listHeading"/>
			</a>
		</h2>
		<!--show the meta data for the LDD-->
		<blockquote>
			<xsl:apply-templates select="mismo:Identification"/>
		</blockquote>
		<!--show the list content, including the meta data for the items-->
		<xsl:variable name="dataCount" select="count(mismo:DataPoints/mismo:Term)"/>
		<xsl:variable name="dataPathCount" select="count(mismo:DataPoints/mismo:Term/mismo:Uses/mismo:Used/mismo:Xpaths/mismo:Xpath)"/>
		<h2>Data Points: <xsl:value-of select="$dataCount"/> Terms <xsl:value-of select="$dataPathCount"/> Locations</h2>
		<xsl:apply-templates select="mismo:DataPoints"/>
		<xsl:variable name="containerCount" select="count(mismo:Containers/mismo:Term)"/>
		<xsl:variable name="containerUseCount" select="count(mismo:Containers/mismo:Term/mismo:Uses/mismo:Used)"/>
		<h2>Containers: <xsl:value-of select="$containerCount"/> Terms <xsl:value-of select="$containerUseCount"/> Uses</h2>
		<xsl:apply-templates select="mismo:Containers"/>
		<xsl:variable name="attributeCount" select="count(mismo:Attributes/mismo:Term)"/>
		<xsl:variable name="attributeUseCount" select="count(mismo:Attributes/mismo:Term[not(@URNSuffix='SequenceNumber' or @URNSuffix='SensitiveIndicator' or @URNSuffix='AttributeExtension' or @URNSuffix='xlink:MISMOarcLink' or @URNSuffix='xlink:MISMOresourceLink')]/mismo:Uses/mismo:Used)"/>
		<h2>Attributes: <xsl:value-of select="$attributeCount"/> Terms <xsl:value-of select="$attributeUseCount"/> Container Uses</h2>
		<xsl:apply-templates select="mismo:Attributes"/>
		<xsl:variable name="roleCount" select="count(mismo:ArcRoles/mismo:Term)"/>
		<h2>Arc Roles: <xsl:value-of select="$roleCount"/> Roles</h2>
		<xsl:apply-templates select="mismo:ArcRoles"/>
		<xsl:variable name="enumerationCount" select="count(mismo:Enumerations/mismo:Term)"/>
		<xsl:variable name="enumerationValueCount" select="count(mismo:Enumerations/mismo:Term/mismo:Type/mismo:Enum)"/>
		<h2>Complete Enumerations: <xsl:value-of select="$enumerationCount"/> Terms <xsl:value-of select="$enumerationValueCount"/> Values</h2>
		<xsl:apply-templates select="mismo:Enumerations"/>
		<xsl:variable name="datatypeCount" select="count(mismo:DataTypes/mismo:Term)"/>
		<h2>Data Types: <xsl:value-of select="$datatypeCount"/> Types</h2>
		<xsl:apply-templates select="mismo:DataTypes"/>
		<xsl:variable name="acronymCount" select="count(mismo:Acronyms/mismo:Term)"/>
		<h2>Acronyms: <xsl:value-of select="$acronymCount"/> Terms</h2>
		<xsl:apply-templates select="mismo:Acronyms"/>
		<h2>Data Usages</h2>
		<table border="1">
		<tr>
			<th align="center">
				<xsl:text>Term Name</xsl:text>
			</th>
			<th align="center">
				<xsl:text>Definition</xsl:text>
			</th>
			<th align="center">
				<xsl:text>Contains DataPoints</xsl:text>
			</th>
			<th align="center">
				<sup>
					<xsl:text>URN="urn:fdc:MISMO.org:2009:residential:LDD:" + As suffix below</xsl:text>
				</sup>
				<br style="mso-data-placement:same-cell;"/>
				<xsl:text>Context Used As/In</xsl:text>
			</th>
			<th align="center">
				<xsl:text>Xpaths</xsl:text>
			</th>
			<th align="center">
				<xsl:text>Attributes</xsl:text>
			</th>
			<th align="center" valign="top">
				<xsl:text>Type</xsl:text>
			</th>
			<th align="center">
				<xsl:text>App Info</xsl:text>
			</th>
			<!--th align="center">
				<xsl:text>Sort Name</xsl:text>
			</th-->
			<!--th align="center" valign="top">
					<sup>
						<xsl:text>Personal Private Information</xsl:text>
					</sup>
				</th-->
		</tr>
			<xsl:apply-templates select="mismo:DataPoints" mode="usage"/>
			<xsl:apply-templates select="mismo:Containers" mode="usage"/>
			<xsl:apply-templates select="mismo:Attributes" mode="usage"/>
			<xsl:apply-templates select="mismo:DataTypes" mode="usage"/>
		</table>
		<h2>Deprecated Data Points Version</h2>
		<xsl:apply-templates select="mismo:DeprecatedDataPointsVersion"/>
		<h2>Deprecated Containers Version</h2>
		<xsl:apply-templates select="mismo:DeprecatedContainersVersion"/>
		<h2>Deprecated Data Points Cumulative</h2>
		<xsl:apply-templates select="mismo:DeprecatedDataPointsCum"/>
		<h2>Deprecated Containers Cumulative</h2>
		<xsl:apply-templates select="mismo:DeprecatedContainersCum"/>
	</xsl:template>
	<!--present the identification infromation in a table-->
	<xsl:template match="mismo:Identification">
		<table>
			<tr>
				<td valign="top">
					<samp>
						<xsl:value-of select="name(.)"/>
						<xsl:if test="@*">
							<xsl:text> (</xsl:text>
							<xsl:for-each select="@*">
								<xsl:if test="position()&gt;1">
									<xsl:text> </xsl:text>
								</xsl:if>
								<xsl:value-of select="concat(name(.),'=&quot;',.,'&quot;')"/>
							</xsl:for-each>
							<xsl:text>)</xsl:text>
						</xsl:if>
					</samp>
				</td>
				<!--td valign="top">
					<samp>=</samp>
				</td>
				<td valign="top">
					<samp>
						<xsl:value-of select="."/>
					</samp>
				</td-->
			</tr>
			<tr>
				<td>
					<xsl:value-of select="mismo:Copyright/@Value"/>
				</td>
			</tr>
			<tr>
				<td>
					<xsl:value-of select="mismo:License/@Value"/>
				</td>
			</tr>
			<tr>
				<td>
					<xsl:value-of select="mismo:Disclaimer/@Value"/>
				</td>
			</tr>
		</table>
	</xsl:template>
	<xsl:template match="mismo:DataPoints">
		<table border="1">
			<tr>
				<th align="center">
					<xsl:text>Data Point</xsl:text>
				</th>
				<th align="center">
					<xsl:text>Definition</xsl:text>
				</th>
				<th align="center">
					<xsl:text>Enumeration : Explanation </xsl:text>
				</th>
				<th align="center">
					<sup>
						<xsl:text>URN="urn:fdc:MISMO.org:2009:residential:LDD:" + As suffix below</xsl:text>
					</sup>
					<br style="mso-data-placement:same-cell;"/>
					<xsl:text>Context Used As/In</xsl:text>
				</th>
				<th align="center">
					<xsl:text>Xpaths</xsl:text>
				</th>
				<th align="center">
					<xsl:text>Attributes</xsl:text>
				</th>
				<th align="center" valign="top">
					<xsl:text>Type</xsl:text>
				</th>
				<th align="center">
					<xsl:text>App Info</xsl:text>
				</th>
				<!--th align="center" valign="top">
					<sup>
						<xsl:text>Personal Private Information</xsl:text>
					</sup>
				</th-->
			</tr>
			<xsl:apply-templates select="mismo:Term" mode="datapoints">
				<xsl:sort select="@Name"/>
				<xsl:sort select="mismo:Type/mismo:Enum/@Value"/>
			</xsl:apply-templates>
		</table>
	</xsl:template>
	<xsl:template match="mismo:Term" mode="datapoints">
		<tr>
			<td align="left" valign="top">
				<xsl:value-of select="@Name"/>
			</td>
			<td align="left" valign="top">
				<xsl:value-of select="@Definition"/>
			</td>
			<td align="left" valign="top">
			<xsl:call-template name="setEnumerations"/>
			</td>
			<td align="left" valign="top">
				<xsl:call-template name="setUses"/>
			</td>
			<td align="left" valign="top">
				<xsl:call-template name="setXpaths"/>
			</td>
			<td align="left" valign="top">
				<xsl:call-template name="setAttributes"/>
			</td>
			<td align="left" valign="top">
				<xsl:choose>
					<xsl:when test="mismo:Type[1]/@Name">
						<xsl:value-of select="substring(mismo:Type[1]/@Name,1,80)"/>
						<xsl:if test="mismo:Type[1]/@Base">
							<br style="mso-data-placement:same-cell;"/>
							<xsl:text>Base: </xsl:text>
							<xsl:value-of select="mismo:Type[1]/@Base"/>
						</xsl:if>
					</xsl:when>
					<xsl:otherwise>
						<xsl:text> </xsl:text>
					</xsl:otherwise>
				</xsl:choose>
			</td>
			<td align="left" valign="top">
				<xsl:choose>
					<xsl:when test="@AppInfo">
						<xsl:value-of select="@AppInfo"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:text> </xsl:text>
					</xsl:otherwise>
				</xsl:choose>
			</td>
			<!--td align="left" valign="top">
				<xsl:choose>
					<xsl:when test="@PPI and @PPIComment">
						<xsl:value-of select="concat(@PPI,' : ',@PPIComment)"/>
					</xsl:when>
					<xsl:when test="@PPI">
						<xsl:value-of select="@PPI"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:text> </xsl:text>
					</xsl:otherwise>
				</xsl:choose>
			</td-->
		</tr>
	</xsl:template>
	<xsl:template match="mismo:Containers">
		<table border="1">
			<tr>
				<th align="center" width="200">Container</th>
				<th align="center" width="500">Definition</th>
				<th align="center" width="500">DataPoints</th>
				<th width="500" align="center">
					<sup>
						<xsl:text>URN="urn:fdc:MISMO.org:2009:residential:LDD:" + As suffix below</xsl:text>
					</sup>
					<br style="mso-data-placement:same-cell;"/>
					<xsl:text>Context Used As/In</xsl:text>
				</th>
				<th align="center">
					<xsl:text>Xpaths</xsl:text>
				</th>
				<th align="center">
					<xsl:text>Attributes</xsl:text>
				</th>
				<th align="center">
					<xsl:text>Type</xsl:text>
				</th>
				<th align="center">
					<xsl:text>App Info</xsl:text>
				</th>
			<!--th align="center" valign="top">
					<sup>
						<xsl:text>Personal Private Information</xsl:text>
					</sup>
				</th-->
			</tr>
			<xsl:apply-templates select="mismo:Term" mode="containers">
				<xsl:sort select="@Name"/>
			</xsl:apply-templates>
		</table>
	</xsl:template>
	<xsl:template match="mismo:Term" mode="containers">
		<xsl:variable name="urn" select="@URNSuffix"/>
		<tr>
			<td align="left" valign="top">
				<xsl:value-of select="@Name"/>
			</td>
			<td align="left" valign="top">
				<xsl:value-of select="@Definition"/>
			</td>
			<td align="left" valign="top">
				<xsl:call-template name="setDataPoints"/>
			</td>
			<td align="left" valign="top">
				<xsl:call-template name="setUses"/>
			</td>
			<td align="left" valign="top">
				<xsl:call-template name="setXpaths"/>
			</td>
			<td align="left" valign="top">
				<xsl:call-template name="setAttributes"/>
			</td>
			<td align="left" valign="top">
				<xsl:choose>
					<xsl:when test="mismo:Type[1]/@Name">
						<xsl:value-of select="substring(mismo:Type[1]/@Name,1,80)"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:text> </xsl:text>
					</xsl:otherwise>
				</xsl:choose>
			</td>
			<td align="left" valign="top">
				<xsl:choose>
					<xsl:when test="@AppInfo">
						<xsl:value-of select="@AppInfo"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:text> </xsl:text>
					</xsl:otherwise>
				</xsl:choose>
			</td>
			<!--td align="left" valign="top">
				<xsl:choose>
					<xsl:when test="@PPI and @PPIComment">
						<xsl:value-of select="concat(@PPI,' : ',@PPIComment)"/>
					</xsl:when>
					<xsl:when test="@PPI">
						<xsl:value-of select="@PPI"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:text> </xsl:text>
					</xsl:otherwise>
				</xsl:choose>
			</td-->
		</tr>
	</xsl:template>
	<xsl:template match="mismo:Attributes">
		<table border="1">
			<tr>
				<th align="center" width="200">Attribute</th>
				<th align="center" width="500">Definition</th>
				<th align="center">
					<xsl:text>Enumeration : Explanation </xsl:text>
				</th>
				<th align="center">
					<sup>
						<xsl:text>URN="urn:fdc:MISMO.org:2009:residential:LDD:" + As suffix below</xsl:text>
					</sup>
					<br style="mso-data-placement:same-cell;"/>
					<xsl:text>Context Used As/In</xsl:text>
				</th>
				<th align="center">
					<xsl:text>Type</xsl:text>
				</th>
				<th align="center">
					<xsl:text>App Info</xsl:text>
				</th>
			<!--th align="center" valign="top">
					<sup>
						<xsl:text>Personal Private Information</xsl:text>
					</sup>
				</th-->
			</tr>
			<xsl:apply-templates select="mismo:Term" mode="attributes">
				<xsl:sort select="@Name"/>
			</xsl:apply-templates>
		</table>
	</xsl:template>
	<xsl:template match="mismo:Term" mode="attributes">
		<tr>
			<td align="left" valign="top">
				<xsl:value-of select="@Name"/>
			</td>
			<td align="left" valign="top">
				<xsl:value-of select="@Definition"/>
			</td>
			<td>
				<xsl:call-template name="setEnumerations"/>
			</td>
			<td align="left" valign="top">
				<xsl:call-template name="setUses"/>
			</td>
			<td align="left" valign="top">
				<xsl:choose>
					<xsl:when test="mismo:Type[1]/@Name">
						<xsl:value-of select="substring(mismo:Type[1]/@Name,1,80)"/>
						<xsl:if test="mismo:Type[1]/@Base">
							<br style="mso-data-placement:same-cell;"/>
							<xsl:text>Base: </xsl:text>
							<xsl:value-of select="mismo:Type[1]/@Base"/>
						</xsl:if>
					</xsl:when>
					<xsl:otherwise>
						<xsl:text> </xsl:text>
					</xsl:otherwise>
				</xsl:choose>
			</td>
			<td align="left" valign="top">
				<xsl:choose>
					<xsl:when test="@AppInfo">
						<xsl:value-of select="@AppInfo"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:text> </xsl:text>
					</xsl:otherwise>
				</xsl:choose>
			</td>
			<!--td align="left" valign="top">
				<xsl:choose>
					<xsl:when test="@PPI and @PPIComment">
						<xsl:value-of select="concat(@PPI,' : ',@PPIComment)"/>
					</xsl:when>
					<xsl:when test="@PPI">
						<xsl:value-of select="@PPI"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:text> </xsl:text>
					</xsl:otherwise>
				</xsl:choose>
			</td-->
		</tr>
	</xsl:template>
	<xsl:template match="mismo:ArcRoles">
		<table border="1">
			<tr>
				<th align="center" width="200">Name</th>
				<th align="center" width="200">Definition</th>
				<th align="center" width="500">Arcrole</th>
				<th align="center" width="500">From</th>
				<th align="center" width="500">To</th>
				<th align="center" width="500">
					<sup>
						<xsl:text>URN="urn:fdc:MISMO.org:2009:residential:LDD: + As suffix below"</xsl:text>
					</sup>
					<br style="mso-data-placement:same-cell;"/>
					<xsl:text>Context Used As/In</xsl:text>
				</th>
				<th align="center" width="500">Xpaths</th>
			</tr>
			<xsl:apply-templates select="mismo:Term" mode="arcroles">
				<xsl:sort select="@Name"/>
			</xsl:apply-templates>
		</table>
	</xsl:template>
	<xsl:template match="mismo:Term" mode="arcroles">
		<tr>
			<xsl:variable name="usesCount" select="count(mismo:Uses/mismo:Used)"/>
			<td align="left" valign="top">
				<xsl:value-of select="@Name"/>
			</td>
			<td align="left" valign="top">
				<xsl:value-of select="@Definition"/>
			</td>
			<td align="left" valign="top">
				<xsl:value-of select="mismo:Type/mismo:Enum[1]/@Value"/>
			</td>
			<td align="left" valign="top">
				<xsl:value-of select="@From"/>
			</td>
			<td align="left" valign="top">
				<xsl:value-of select="@To"/>
			</td>
			<td align="left" valign="top">
				<xsl:text>Used As: </xsl:text>
				<xsl:value-of select="@URNSuffix"/>
				<!--br style="mso-data-placement:same-cell;" /-->
				<xsl:text> By </xsl:text>
				<xsl:value-of select="$usesCount"/>
				<xsl:text> Relationships</xsl:text>
				<xsl:for-each select="mismo:Uses/mismo:Used">
					<xsl:sort select="@In"/>
					<xsl:sort select="mismo:Xpaths/mismo:Xpath[@For='from']/@Value"/>
					<xsl:sort select="mismo:Xpaths/mismo:Xpath[@For='to']/@Value"/>
					<br/>
					<xsl:value-of select="@In"/>
					<xsl:if test="string-length(@Definition)>0">
						<xsl:text> : </xsl:text>
						<xsl:value-of select="@Definition"/>
					</xsl:if>
				</xsl:for-each>
			</td>
			<td align="left" valign="top">
				<xsl:variable name="xpathCount" select="count(mismo:Uses/mismo:Used/mismo:Xpaths/mismo:Xpath[@For='from'])"/>
				<xsl:text>Count = </xsl:text>
				<xsl:value-of select="$xpathCount"/>
				<xsl:for-each select="mismo:Uses/mismo:Used">
					<xsl:sort select="@In"/>
					<xsl:sort select="mismo:Xpaths/mismo:Xpath[@For='from']/@Value"/>
					<xsl:sort select="mismo:Xpaths/mismo:Xpath[@For='to']/@Value"/>
					<br/>
					<xsl:for-each select="mismo:Xpaths/mismo:Xpath">
						<xsl:sort select="@For"/>
						<br style="mso-data-placement:same-cell;"/>
						<xsl:value-of select="concat(@For,': ',@Value)"/>
					</xsl:for-each>
				</xsl:for-each>
			</td>
		</tr>
	</xsl:template>
	<xsl:template match="mismo:Enumerations">
		<table border="1">
			<tr>
				<th align="center" width="200">Base Term</th>
				<th align="center" width="500">
					<sup>
						<xsl:text>URN="urn:fdc:MISMO.org:2009:residential:LDD:"</xsl:text>
						<br style="mso-data-placement:same-cell;"/>
						<xsl:text>+ Used By below + ":" + Enumeration Value on right</xsl:text>
					</sup>
					<br style="mso-data-placement:same-cell;"/>
					<xsl:text>Context Used By : Definition</xsl:text>
				</th>
				<th align="center">
					<xsl:text>Enumeration Value : Explanation </xsl:text>
				</th>
				<th align="center">
					<xsl:text>Type Used As/By</xsl:text>
				</th>
				<th align="center" valign="top">
					<xsl:text>App Info</xsl:text>
				</th>
				<!--th align="center" valign="top">
					<xsl:text>Sort Name</xsl:text>
				</th-->
			</tr>
			<xsl:apply-templates select="mismo:Term" mode="enumerations">
				<xsl:sort select="@Name"/>
			</xsl:apply-templates>
		</table>
	</xsl:template>
	<xsl:template match="mismo:Term" mode="enumerations">
		<!--xsl:variable name="thisRow" select="."/-->
		<xsl:variable name="term" select="@URNSuffix"/>
		<xsl:variable name="usesCount" select="count(//mismo:LDD/mismo:*[local-name()='DataPoints' or local-name()='Attributes']/mismo:Term[mismo:Type[@Name=$term or @Base=$term]])"/>
		<xsl:variable name="displayName" select="concat(substring(@Name,1,string-length(@Name)-4),'Type')"/>
		<tr>
			<td align="left" valign="top">
				<xsl:value-of select="$displayName"/>
				<!--xsl:for-each select="mismo:Type/mismo:Enum"><br/><span style="color:white"><xsl:value-of select="$displayName"/></span></xsl:for-each-->
			</td>
			<td align="left" valign="top">
				<xsl:text>Types count = </xsl:text>
				<xsl:value-of select="$usesCount"/>
				<xsl:choose>
					<xsl:when test="$usesCount > 0">
						<xsl:for-each select="//mismo:LDD/mismo:*[local-name()='DataPoints' or local-name()='Attributes']/mismo:Term[mismo:Type[@Name=$term or @Base=$term]]">
							<xsl:sort select="@URNSuffix"/>
							<br/>
							<xsl:value-of select="concat(@URNSuffix,' : ',@Definition)"/>
						</xsl:for-each>
					</xsl:when>
					<xsl:otherwise>
						<xsl:text> </xsl:text>
					</xsl:otherwise>
				</xsl:choose>
			</td>
			<td align="left" valign="top">
				<xsl:choose>
					<xsl:when test="mismo:Type/mismo:Enum">
						<xsl:for-each select="mismo:Type/mismo:Enum">
							<xsl:sort select="@Value"/>
							<br/>
								<!--xsl:choose>
									<xsl:when test="starts-with(@Version,$majorVersion) and not(substring-after(substring-after(@Version,'.'),'.')='0')">
										<xsl:value-of select="concat(@Value,' [',@Version,'] : ',@Definition )"/>
									</xsl:when>
									<xsl:otherwise-->
										<xsl:value-of select="concat(@Value,' : ',@Definition )"/>
									<!--/xsl:otherwise>
								</xsl:choose-->
							<!--xsl:if test="not( . = last())">
								<br/>
							</xsl:if-->
						</xsl:for-each>
					</xsl:when>
					<xsl:otherwise>
						<xsl:text> </xsl:text>
					</xsl:otherwise>
				</xsl:choose>
			</td>
			<td align="left" valign="top">
				<xsl:text>Used As : </xsl:text>
				<xsl:value-of select="@URNSuffix"/>
				<!--br style="mso-data-placement:same-cell;" /-->
				<xsl:text> By </xsl:text>
				<xsl:value-of select="$usesCount"/>
				<xsl:text> Types</xsl:text>
				<xsl:for-each select="//mismo:LDD/mismo:*[local-name()='DataPoints' or local-name()='Attributes']/mismo:Term[mismo:Type[@Name=$term or @Base=$term]]">
					<xsl:sort select="@URNSuffix"/>
				<br style="mso-data-placement:same-cell;" />
					<!--br/-->
					<xsl:value-of select="mismo:Type/@Name"/>
				</xsl:for-each>
				<xsl:choose>
					<xsl:when test="mismo:Type/mismo:Enum">
						<xsl:for-each select="mismo:Type/mismo:Enum">
							<xsl:sort select="@Value"/>
							<br/>
							<xsl:if test="@InSchema='false'">
							<xsl:value-of select=" 'Not Used' "/>
							</xsl:if>
						</xsl:for-each>
					</xsl:when>
					<xsl:otherwise>
						<xsl:text> </xsl:text>
					</xsl:otherwise>
				</xsl:choose>
			</td>
			<td align="left" valign="top">
				<xsl:choose>
					<xsl:when test="@AppInfo">
						<xsl:value-of select="@AppInfo"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:text> </xsl:text>
					</xsl:otherwise>
				</xsl:choose>
			</td>
			<!--td align="left" valign="top">
				<xsl:value-of select="$displayName"/>
				<xsl:for-each select="mismo:Type/mismo:Enum"><br/><span style="color:white"><xsl:value-of select="$displayName"/></span></xsl:for-each>
			</td-->
		</tr>
	</xsl:template>
	<xsl:template match="mismo:Acronyms">
		<table border="1">
			<tr>
				<th align="center" width="200">Acronym</th>
				<th align="center" width="500">Definition</th>
				<th align="center">
					<xsl:text>Context Used In</xsl:text>
				</th>
			<!--th align="center" valign="top">
					<sup>
						<xsl:text>Personal Private Information</xsl:text>
					</sup>
				</th-->
			</tr>
			<xsl:apply-templates select="mismo:Term" mode="acronyms">
				<xsl:sort select="@Name"/>
			</xsl:apply-templates>
		</table>
	</xsl:template>
	<xsl:template match="mismo:Term" mode="acronyms">
		<tr>
			<td align="left" valign="top">
				<xsl:value-of select="@Name"/>
			</td>
			<td align="left" valign="top">
				<xsl:value-of select="@Definition"/>
			</td>
			<td align="left" valign="top">
				<xsl:variable name="usesCount" select="count(mismo:Uses/mismo:Used)"/>
				<xsl:text>Used In </xsl:text>
				<xsl:value-of select="$usesCount"/>
				<xsl:text> Terms</xsl:text>
				<xsl:for-each select="mismo:Uses/mismo:Used">
					<xsl:sort select="@In"/>
					<xsl:sort select="@As"/>
					<br/>
					<xsl:value-of select="@In"/>
					<xsl:if test="string-length(@As)>0">
					<xsl:value-of select="concat(' as: ',@As)"/>
					</xsl:if>
				</xsl:for-each>
			</td>
		</tr>
	</xsl:template>
	<xsl:template match="mismo:DataPoints" mode="usage">
		<xsl:apply-templates select="mismo:Term" mode="elementUsage">
			<xsl:sort select="@Name"/>
		</xsl:apply-templates>
	</xsl:template>
	<xsl:template match="mismo:Containers" mode="usage">
		<xsl:apply-templates select="mismo:Term" mode="elementUsage">
			<xsl:sort select="@Name"/>
		</xsl:apply-templates>
	</xsl:template>
	<xsl:template match="mismo:Term" mode="elementUsage">
		<xsl:variable name="termType" select="mismo:Type/@Name"/>
		<xsl:variable name="enumType" select="mismo:Type/@Base"/>
		<xsl:variable name="urn" select="@URNSuffix"/>
		<xsl:variable name="dataPointCount" select="count(//mismo:DataPoints/mismo:Term[mismo:Uses/mismo:Used/@In=$urn])"/>
		<xsl:variable name="usesCount" select="count(mismo:Uses/mismo:Used)"/>
		<xsl:variable name="xpathCount" select="count(mismo:Uses/mismo:Used/mismo:Xpaths/mismo:Xpath)"/>
				<xsl:variable name="attributeCount" select="count(//mismo:Attributes/mismo:Term[mismo:Uses/mismo:Used/@In=$urn])"/>
		<xsl:variable name="displayName" select="@Name"/>
		<tr>
			<td align="left" valign="top">
				<xsl:value-of select="$displayName"/>
				<!--xsl:choose>
					<xsl:when test="$xpathCount >= $attributeCount and $xpathCount >= $dataPointCount">
						<xsl:for-each select="mismo:Uses/mismo:Used/mismo:Xpaths/mismo:Xpath"><br/><span style="color:white"><xsl:value-of select="$displayName"/></span></xsl:for-each>
					</xsl:when>
					<xsl:when test="$dataPointCount >= $attributeCount and $dataPointCount >= $xpathCount">
						<xsl:for-each select="//mismo:DataPoints/mismo:Term[mismo:Uses/mismo:Used/@In=$urn]"><br/><span style="color:white"><xsl:value-of select="$displayName"/></span></xsl:for-each>
					</xsl:when>
					<xsl:when test="$attributeCount >= $dataPointCount and $attributeCount >= $xpathCount">
						<xsl:for-each select="//mismo:Attributes/mismo:Term[mismo:Uses/mismo:Used/@In=$urn]"><br/><span style="color:white"><xsl:value-of select="$displayName"/></span></xsl:for-each>
					</xsl:when>
				</xsl:choose-->
			</td>
			<td align="left" valign="top">
				<xsl:value-of select="@Definition"/>
			</td>
			<td align="left" valign="top">
				<xsl:choose>
					<xsl:when test="$dataPointCount>0">
						<xsl:text>Count = </xsl:text>
						<xsl:value-of select="$dataPointCount"/>
						<xsl:for-each select="//mismo:DataPoints/mismo:Term[mismo:Uses/mismo:Used/@In=$urn]">
							<xsl:sort select="@URNSuffix"/>
								<br />
								<xsl:value-of select="@URNSuffix"/>
				</xsl:for-each>
			</xsl:when>
			<xsl:otherwise>
				<xsl:text> </xsl:text>
			</xsl:otherwise>
		</xsl:choose>
			</td>
			<td align="left" valign="top">
				<xsl:text>Used As: </xsl:text>
				<xsl:value-of select="@URNSuffix"/>
				<br style="mso-data-placement:same-cell;"/>
				<xsl:text>In </xsl:text>
				<xsl:value-of select="$usesCount"/>
				<xsl:text> Containers</xsl:text>
				<xsl:for-each select="mismo:Uses/mismo:Used">
					<xsl:sort select="@In"/>
					<br/>
					<xsl:value-of select="@In"/>
					<xsl:for-each select="mismo:Xpaths/mismo:Xpath">
						<xsl:if test="position()!=1"><br/></xsl:if>
					</xsl:for-each>
				</xsl:for-each>
			</td>
			<td align="left" valign="top">
				<xsl:text>Count = </xsl:text>
				<xsl:value-of select="$xpathCount"/>
				<xsl:for-each select="mismo:Uses/mismo:Used">
					<xsl:sort select="@In"/>
					<!--xsl:if test="position()=1"--><br/><!--/xsl:if-->
					<xsl:for-each select="mismo:Xpaths/mismo:Xpath">
						<xsl:value-of select="@Value"/>
						<xsl:if test="not(position()=last())">
							<br/>
						</xsl:if>
					</xsl:for-each>
				</xsl:for-each>
			</td>
			<td align="left" valign="top">
				<xsl:text>Count = </xsl:text>
				<xsl:value-of select="$attributeCount"/>
				<xsl:for-each select="//mismo:Attributes/mismo:Term[mismo:Uses/mismo:Used[@In=$urn]]">
					<xsl:sort select="@URNSuffix"/>
					<br/>
					<xsl:value-of select="@URNSuffix"/>
				</xsl:for-each>
			</td>
			<td align="left" valign="top">
				<xsl:choose>
					<xsl:when test="mismo:Type[1]/@Name">
						<xsl:value-of select="substring(mismo:Type[1]/@Name,1,80)"/>
						<xsl:if test="mismo:Type[1]/@Base">
							<br/>
							<xsl:text>Base: </xsl:text>
							<xsl:value-of select="mismo:Type[1]/@Base"/>
						</xsl:if>
					</xsl:when>
					<xsl:otherwise>
						<xsl:text> </xsl:text>
					</xsl:otherwise>
				</xsl:choose>
			</td>
			<td align="left" valign="top">
				<xsl:choose>
					<xsl:when test="@AppInfo">
						<xsl:value-of select="@AppInfo"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:text> </xsl:text>
					</xsl:otherwise>
				</xsl:choose>
			</td>
			<!--td align="left" valign="top">
				<xsl:value-of select="$displayName"/>
				<xsl:choose>
					<xsl:when test="$xpathCount >= $attributeCount and $xpathCount >= $dataPointCount">
						<xsl:for-each select="mismo:Uses/mismo:Used/mismo:Xpaths/mismo:Xpath"><br/><span style="color:white"><xsl:value-of select="$displayName"/></span></xsl:for-each>
					</xsl:when>
					<xsl:when test="$dataPointCount >= $attributeCount and $dataPointCount >= $xpathCount">
						<xsl:for-each select="//mismo:DataPoints/mismo:Term[mismo:Uses/mismo:Used/@In=$urn]"><br/><span style="color:white"><xsl:value-of select="$displayName"/></span></xsl:for-each>
					</xsl:when>
					<xsl:when test="$attributeCount >= $dataPointCount and $attributeCount >= $xpathCount">
						<xsl:for-each select="//mismo:Attributes/mismo:Term[mismo:Uses/mismo:Used/@In=$urn]"><br/><span style="color:white"><xsl:value-of select="$displayName"/></span></xsl:for-each>
					</xsl:when>
				</xsl:choose>
			</td-->
		</tr>
	</xsl:template>
	<xsl:template match="mismo:Attributes" mode="usage">
		<xsl:apply-templates select="mismo:Term" mode="attributeUsage">
			<xsl:sort select="@Name"/>
		</xsl:apply-templates>
	</xsl:template>
	<xsl:template match="mismo:Term" mode="attributeUsage">
		<xsl:variable name="termType" select="mismo:Type/@Name"/>
		<xsl:variable name="displayName" select="@Name"/>
		<tr>
			<td align="left" valign="top">
				<xsl:value-of select="$displayName"/>
				<!--xsl:for-each select="mismo:Uses/mismo:Used"><br/><span style="color:white"><xsl:value-of select="$displayName"/></span></xsl:for-each-->
			</td>
			<td align="left" valign="top">
				<xsl:value-of select="@Definition"/>
			</td>
			<td align="left" valign="top">
				<xsl:value-of select=" ' ' "/>
			</td>
			<td align="left" valign="top">
				<xsl:variable name="usesCount" select="count(mismo:Uses/mismo:Used)"/>
				<xsl:text>Used As: </xsl:text>
				<xsl:value-of select="@URNSuffix"/>
				<br style="mso-data-placement:same-cell;"/>
				<xsl:text>In </xsl:text>
				<xsl:value-of select="$usesCount"/>
				<xsl:text> Terms</xsl:text>
					<xsl:for-each select="mismo:Uses/mismo:Used"><br/><xsl:value-of select="@In"/>
				</xsl:for-each>
			</td>
			<td align="left" valign="top">
				<xsl:text> </xsl:text>
			</td>
			<td align="left" valign="top">
				<xsl:choose>
					<xsl:when test="mismo:Type[1]/@Name">
						<xsl:value-of select="substring(mismo:Type[1]/@Name,1,80)"/>
						<xsl:if test="mismo:Type[1]/@Base">
							<br style="mso-data-placement:same-cell;"/>
							<xsl:text>Base: </xsl:text>
							<xsl:value-of select="mismo:Type[1]/@Base"/>
						</xsl:if>
					</xsl:when>
					<xsl:otherwise>
						<xsl:text> </xsl:text>
					</xsl:otherwise>
				</xsl:choose>
			</td>
			<td align="left" valign="top">
				<xsl:choose>
					<xsl:when test="@AppInfo">
						<xsl:value-of select="@AppInfo"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:text> </xsl:text>
					</xsl:otherwise>
				</xsl:choose>
			</td>
		</tr>
	</xsl:template>
	<xsl:template match="mismo:DataTypes" mode="usage">
		<xsl:apply-templates select="mismo:Term" mode="datatypeUsage">
			<xsl:sort select="@Name"/>
		</xsl:apply-templates>
	</xsl:template>
	<xsl:template match="mismo:Term" mode="datatypeUsage">
		<xsl:variable name="termType" select="mismo:Type/@Name"/>
		<xsl:variable name="displayName" select="@Name"/>
		<tr>
			<td align="left" valign="top">
				<xsl:value-of select="$displayName"/>
				<!--xsl:for-each select="mismo:Uses/mismo:Used"><br/><span style="color:white"><xsl:value-of select="$displayName"/></span></xsl:for-each-->
			</td>
			<td align="left" valign="top">
				<xsl:value-of select="@Definition"/>
			</td>
			<td align="left" valign="top">
				<xsl:value-of select=" ' ' "/>
			</td>
			<td align="left" valign="top">
				<xsl:variable name="usesCount" select="count(mismo:Uses/mismo:Used)"/>
				<xsl:text>Used As: </xsl:text>
				<xsl:value-of select="@URNSuffix"/>
				<br style="mso-data-placement:same-cell;"/>
				<xsl:text>By </xsl:text>
				<xsl:value-of select="$usesCount"/>
				<xsl:text> Data Terms</xsl:text>
				<xsl:for-each select="mismo:Uses/mismo:Used"><br/><xsl:value-of select="@In"/>
				</xsl:for-each>
			</td>
			<td align="left" valign="top">
				<xsl:text> </xsl:text>
			</td>
			<td align="left" valign="top">
				<xsl:choose>
					<xsl:when test="mismo:Type[1]/@Name">
						<xsl:value-of select="substring(mismo:Type[1]/@Name,1,80)"/>
						<xsl:if test="mismo:Type[1]/@Base">
							<br style="mso-data-placement:same-cell;"/>
							<xsl:text>Base: </xsl:text>
							<xsl:value-of select="mismo:Type[1]/@Base"/>
						</xsl:if>
					</xsl:when>
					<xsl:otherwise>
						<xsl:text> </xsl:text>
					</xsl:otherwise>
				</xsl:choose>
			</td>
			<td align="left" valign="top">
				<xsl:choose>
					<xsl:when test="@AppInfo">
						<xsl:value-of select="@AppInfo"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:text> </xsl:text>
					</xsl:otherwise>
				</xsl:choose>
			</td>
		</tr>
	</xsl:template>
	<xsl:template match="mismo:DataTypes">
		<table border="1">
			<tr>
				<th align="center" width="200">Data Type</th>
				<th align="center" width="500">Definition</th>
				<th width="500" align="center">
					<sup>
						<xsl:text>URN="urn:fdc:MISMO.org:2009:residential:LDD:" + As suffix below</xsl:text>
					</sup>
					<br style="mso-data-placement:same-cell;"/>
					<xsl:text>Context Used As/For</xsl:text>
				</th>
				<th align="center">
					<xsl:text>Derivation</xsl:text>
				</th>
				<th align="center">
					<xsl:text>Constraints</xsl:text>
				</th>
				<th align="center">
					<xsl:text>Attributes</xsl:text>
				</th>
				<th align="center">
					<xsl:text>App Info</xsl:text>
				</th>
			<!--th align="center" valign="top">
					<sup>
						<xsl:text>Personal Private Information</xsl:text>
					</sup>
				</th-->
			</tr>
			<xsl:apply-templates select="mismo:Term" mode="datatypes">
				<xsl:sort select="@Name"/>
			</xsl:apply-templates>
		</table>
	</xsl:template>
	<xsl:template match="mismo:Term" mode="datatypes">
		<xsl:variable name="urn" select="@URNSuffix"/>
		<tr>
			<td align="left" valign="top">
				<xsl:value-of select="@Name"/>
			</td>
			<td align="left" valign="top">
				<xsl:value-of select="@Definition"/>
			</td>
			<td align="left" valign="top">
				<xsl:call-template name="setUses"/>
			</td>
			<td align="left" valign="top">
				<xsl:value-of select="mismo:Type/@Derivation"/>
			</td>
			<td align="left" valign="top">
				<xsl:for-each select="mismo:Type/mismo:*">
					<xsl:variable name="facet" select="local-name()"/>
					<br style="mso-data-placement:same-cell;"/>
					<xsl:value-of select="concat($facet,': ',@Value)"/>
				</xsl:for-each>
			</td>
			<td align="left" valign="top">
				<xsl:call-template name="setAttributes"/>
			</td>
			<td align="left" valign="top">
				<xsl:choose>
					<xsl:when test="@AppInfo">
						<xsl:value-of select="@AppInfo"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:text> </xsl:text>
					</xsl:otherwise>
				</xsl:choose>
			</td>
			<!--td align="left" valign="top">
				<xsl:choose>
					<xsl:when test="@PPI and @PPIComment">
						<xsl:value-of select="concat(@PPI,' : ',@PPIComment)"/>
					</xsl:when>
					<xsl:when test="@PPI">
						<xsl:value-of select="@PPI"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:text> </xsl:text>
					</xsl:otherwise>
				</xsl:choose>
			</td-->
		</tr>
	</xsl:template>
	<xsl:template match="mismo:DeprecatedDataPointsCum | mismo:DeprecatedDataPointsVersion">
		<table border="1">
			<tr>
				<th align="center">
					<xsl:text>Deprecated Data Point</xsl:text>
				</th>
				<th align="center">
					<xsl:text>Definition</xsl:text>
				</th>
				<th align="center">
					<xsl:text>Enumeration  : Explanation </xsl:text>
				</th>
				<th align="center">
					<sup>
						<xsl:text>URN="urn:fdc:MISMO.org:2009:residential:LDD:" + As suffix below</xsl:text>
					</sup>
					<br style="mso-data-placement:same-cell;"/>
					<xsl:text>Context Used As/In</xsl:text>
				</th>
				<th align="center">
					<xsl:text>Xpaths</xsl:text>
				</th>
				<th align="center">
					<xsl:text>Attributes</xsl:text>
				</th>
				<th align="center" valign="top">
					<xsl:text>Type</xsl:text>
				</th>
				<th align="center">
					<xsl:text>App Info</xsl:text>
				</th>
				<!--th align="center" valign="top">
					<sup>
						<xsl:text>Personal Private Information</xsl:text>
					</sup>
				</th-->
			</tr>
			<xsl:apply-templates select="mismo:Term" mode="datapoints">
				<xsl:sort select="@Name"/>
				<xsl:sort select="mismo:Type/mismo:Enum/@Value"/>
			</xsl:apply-templates>
		</table>
	</xsl:template>
	<xsl:template match="mismo:DeprecatedContainersCum | mismo:DeprecatedContainersVersion">
		<table border="1">
			<tr>
				<th align="center" width="200">Deprecated Container</th>
				<th align="center" width="500">Definition</th>
				<th width="500" align="center">
					<sup>
						<xsl:text>URN="urn:fdc:MISMO.org:2009:residential:LDD:" + As suffix below</xsl:text>
					</sup>
					<br style="mso-data-placement:same-cell;"/>
					<xsl:text>Context Used As/In</xsl:text>
				</th>
				<th align="center">
					<xsl:text>Xpaths</xsl:text>
				</th>
				<th align="center">
					<xsl:text>Attributes</xsl:text>
				</th>
				<th align="center">
					<xsl:text>Type</xsl:text>
				</th>
				<th align="center">
					<xsl:text>App Info</xsl:text>
				</th>
			</tr>
			<xsl:apply-templates select="mismo:Term" mode="containers">
				<xsl:sort select="@Name"/>
			</xsl:apply-templates>
		</table>
	</xsl:template>
	<xsl:template name="setUses">
		<xsl:variable name="usesCount" select="count(mismo:Uses/mismo:Used)"/>
		<xsl:text>Used As: </xsl:text>
		<xsl:value-of select="@URNSuffix"/>
		<br style="mso-data-placement:same-cell;"/>
		<xsl:choose>
			<xsl:when test="ancestor::mismo:DataTypes">
		<xsl:text> For </xsl:text>
		<xsl:value-of select="$usesCount"/>
		<xsl:text> Data Terms</xsl:text>
			</xsl:when>
			<xsl:otherwise>
		<xsl:text>In </xsl:text>
		<xsl:value-of select="$usesCount"/>
		<xsl:text> Containers</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:if test="$usesCount > $maxRows">
			<xsl:text>,  Display first </xsl:text>
			<xsl:value-of select="$maxRows"/>
		</xsl:if>
		<xsl:for-each select="mismo:Uses/mismo:Used">
			<xsl:sort select="@In"/>
			<xsl:if test="not(position() > $maxRows)">
				<br style="mso-data-placement:same-cell;"/>
				<xsl:value-of select="@In"/>
			</xsl:if>
		</xsl:for-each>
	</xsl:template>
	<xsl:template name="setEnumerations">
		<xsl:variable name="termType" select="mismo:Type/@Name"/>
		<xsl:variable name="enumType">
			<xsl:choose>
				<xsl:when test="string-length(mismo:Type/@Base)>0">
					<xsl:value-of select="mismo:Type/@Base"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="$termType"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="urn" select="@URNSuffix"/>
		<xsl:choose>
					<xsl:when test="substring($enumType,string-length($enumType)-3,4)='Base' and count(//mismo:Enumerations[mismo:Term/@URNSuffix=$enumType])>0">
						<xsl:variable name="enumCount" select="count(//mismo:Enumerations/mismo:Term[@URNSuffix=$enumType]/mismo:Type/mismo:Enum)"/>
						<xsl:text>Count = </xsl:text>
						<xsl:value-of select="$enumCount"/>
						<xsl:if test="$enumCount > $maxRows">
							<xsl:text>,  Display first </xsl:text>
							<xsl:value-of select="$maxRows"/>
						</xsl:if>
						<xsl:for-each select="//mismo:Enumerations/mismo:Term[@URNSuffix=$enumType]/mismo:Type/mismo:Enum">
							<xsl:sort select="@Value"/>
							<xsl:if test="not(position() > $maxRows)">
								<br style="mso-data-placement:same-cell;"/>
								<!--xsl:choose>
									<xsl:when test="starts-with(@Version,$majorVersion) and not(substring-after(substring-after(@Version,'.'),'.')='0')">
										<xsl:value-of select="concat(@Value,' [',@Version,'] : ',@Definition )"/>
									</xsl:when>
									<xsl:otherwise-->
										<xsl:value-of select="concat(@Value,' : ',@Definition )"/>
									<!--/xsl:otherwise>
								</xsl:choose-->
							</xsl:if>
						</xsl:for-each>
					</xsl:when>
					<xsl:otherwise>
						<xsl:text> </xsl:text>
					</xsl:otherwise>
				</xsl:choose>
	</xsl:template>
	<xsl:template name="setDataPoints">
		<xsl:variable name="urn" select="@URNSuffix"/>
		<xsl:variable name="dataPointCount" select="count(//mismo:DataPoints/mismo:Term[mismo:Uses/mismo:Used/@In=$urn])"/>
		<xsl:choose>
			<xsl:when test="$dataPointCount>0">
				<xsl:text>Count = </xsl:text>
				<xsl:value-of select="$dataPointCount"/>
				<xsl:if test="$dataPointCount > $maxRows">
					<xsl:text>,  Display first </xsl:text>
					<xsl:value-of select="$maxRows"/>
					</xsl:if>
				<xsl:for-each select="//mismo:DataPoints/mismo:Term[mismo:Uses/mismo:Used/@In=$urn]">
					<xsl:sort select="@URNSuffix"/>
					<xsl:if test="not(position() > $maxRows)">
						<br style="mso-data-placement:same-cell;"/>
						<xsl:value-of select="@URNSuffix"/>
					</xsl:if>
				</xsl:for-each>
			</xsl:when>
			<xsl:otherwise>
				<xsl:text> </xsl:text>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="setXpaths">
				<xsl:variable name="xpathCount" select="count(mismo:Uses/mismo:Used/mismo:Xpaths/mismo:Xpath)"/>
				<xsl:text>Count = </xsl:text>
				<xsl:value-of select="$xpathCount"/>
				<xsl:if test="$xpathCount > $maxRows">
					<xsl:text>,  Display first </xsl:text>
					<xsl:value-of select="$maxRows"/>
				</xsl:if>
				<xsl:for-each select="mismo:Uses/mismo:Used/mismo:Xpaths/mismo:Xpath">
					<xsl:sort select="@Value"/>
					<xsl:if test="not(position() > $maxRows)">
						<br style="mso-data-placement:same-cell;"/>
						<xsl:value-of select="@Value"/>
					</xsl:if>
				</xsl:for-each>
	</xsl:template>
	<xsl:template name="setAttributes">
		<xsl:variable name="urn" select="@URNSuffix"/>
				<xsl:variable name="attributeCount" select="count(//mismo:Attributes/mismo:Term[mismo:Uses/mismo:Used/@In=$urn])"/>
				<xsl:text>Count = </xsl:text>
				<xsl:value-of select="$attributeCount"/>
				<xsl:if test="$attributeCount > $maxRows">
					<xsl:text>,  Display first </xsl:text>
					<xsl:value-of select="$maxRows"/>
				</xsl:if>
				<xsl:for-each select="//mismo:Attributes/mismo:Term[mismo:Uses/mismo:Used[@In=$urn]]">
					<xsl:sort select="@URNSuffix"/>
					<xsl:if test="not(position() > $maxRows)">
						<br style="mso-data-placement:same-cell;"/>
						<xsl:value-of select="@URNSuffix"/>
					</xsl:if>
				</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>
