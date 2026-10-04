To interact with Oracle BI Publisher (BIP) reports, you must first obtain the proper WSDL URL from your Oracle Fusion environment, which can then be used either to configure a connection in Oracle Integration Cloud (OIC) or to test directly using SoapUI. [1] 
------------------------------
## 1. How to Get the WSDL URL
Oracle Fusion provides standard, protected web services to run reports synchronously. [2] 
Replace <your_fusion_base_url> with your actual Oracle Cloud domain (e.g., https://fa-abcd-test.fa.ocs.oraclecloud.com) to get the URL: [1] 

* Primary Protected WSDL (Recommended):
https://<your_fusion_base_url>/xmlpserver/services/ExternalReportWSSService?WSDL
* Public/V2 Alternative:
https://<your_fusion_base_url>/xmlpserver/services/v2/ReportService?WSDL [1, 2] 

------------------------------
## 2. How to Define the SOAP WSDL Connection in OIC
To consume this web service inside Oracle Integration Cloud, you must create an outbound SOAP connection. [3, 4] 
## Step-by-Step Configuration:

   1. Create Connection: Log into [Oracle Integration](https://docs.oracle.com/en/cloud/paas/application-integration/soap-adapter/using-soap-adapter-oracle-integration-generation-3.pdf), navigate to Design > Connections, and click Create. [3, 5] 
   2. Select Adapter: Search for and select the SOAP Adapter. [5, 6] 
   3. Basic Info: Name your connection (e.g., BIP_Report_SOAP_Conn) and set the role to Invoke or Trigger and Invoke. Click Create. [3, 5] 
   4. Configure Properties:
   * In the WSDL URL field, paste the ExternalReportWSSService URL obtained above.
      * Ensure the TLS Version is left default (OIC handles this automatically). [1, 5, 7] 
   5. Configure Security:
   * Set the Security Policy to Username Password Token.
      * Provide the Username and Password of a Fusion user account assigned the Integration Specialist or BI Consumer role. [3] 
   6. Test and Save: Click Test at the top right, followed by Validate and Test. Once the status indicator hits 100%, save your progress. [3, 5] 

------------------------------
## 3. How to Call the Report in SoapUI
SoapUI allows you to quickly validate your data payloads and test the execution before building an OIC orchestration flow.
## Step 1: Initialize the Project

   1. Open SoapUI, click File > New SOAP Project.
   2. Paste your ExternalReportWSSService?WSDL link into the Initial WSDL field.
   3. SoapUI automatically populates the project name and imports all structural elements (like runReport, scheduleReport). [1, 8, 9] 

## Step 2: Configure Authentication Headers [10] 
Because ExternalReportWSSService is a protected service, it expects credentials in the request header: [2] 

   1. Expand the runReport operation in the left navigation tree and double-click the sample request.
   2. Look at the bottom of the request interface and select the Auth tab.
   3. Change the Authorization dropdown to Basic.
   4. Input your Fusion cloud Username and Password.
   5. Right-click the authentication area and choose Pre-emptive authentication to enforce sending credentials instantly.

## Step 3: Populate the Payload [3] 
Locate the <pub:runReport> section within the XML schema, clear out unneeded optional fields, and fill in the target parameters: [1] 

<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:pub="http://xmlns.oracle.com/oxp/service/PublicReportService">
   <soap:Header/>
   <soap:Body>
      <pub:runReport>
         <pub:reportRequest>
            <!-- Absolute path of report in BI Catalog -->
            <pub:reportAbsolutePath>/Custom/Financials/MyCustomReport.xdo</pub:reportAbsolutePath>
            <!-- Target output format: pdf, csv, excel, xml -->
            <pub:attributeFormat>csv</pub:attributeFormat>
            <!-- Optional: include runtime parameters if your report requires them -->
            <pub:parameterNameValues>
               <pub:item>
                  <pub:name>p_from_date</pub:name>
                  <pub:values>
                     <pub:item>2026-01-01</pub:item>
                  </pub:values>
               </pub:item>
            </pub:parameterNameValues>
         </pub:reportRequest>
      </pub:runReport>
   </soap:Body>
</soap:Envelope>

## Step 4: Execute and Read Output

   1. Press the green Play/Submit button at the top left of the request window.
   2. Review the right pane for the XML response. The actual report data will be enclosed inside the <reportBytes> tag as a lengthy, raw Base64-encoded text string.
   3. Copy that string and pass it through an external Base64 decoder tool to extract the final CSV, PDF, or text layout. [2] 

------------------------------
Would you like help mapping the Base64 reportBytes response to an SFTP server inside your OIC Integration workflow? [11] 

[1] [https://bcloudglobalservices.com](https://bcloudglobalservices.com/2026/01/12/how-to-call-bip-report-in-a-vbcs-application/)
[2] [https://docs.oracle.com](https://docs.oracle.com/en/cloud/paas/application-integration/soap-adapter/call-oracle-fusion-applications-business-intelligence-publisher-report-services.html)
[3] [https://fusionpractices.com](https://fusionpractices.com/blog/how-to-call-bip-report-in-oracle-integration-cloud/)
[4] [https://docs.oracle.com](https://docs.oracle.com/en/cloud/paas/application-integration/soap-adapter/using-soap-adapter-oracle-integration-generation-3.pdf)
[5] [https://nadim-warsi.blogspot.com](http://nadim-warsi.blogspot.com/2018/04/ics-how-to-create-soap-connection-to.html)
[6] [https://fusionpractices.com](https://fusionpractices.com/blog/how-to-call-bip-report-in-oracle-integration-cloud/)
[7] [https://docs.oracle.com](https://docs.oracle.com/en/cloud/paas/integration-cloud/soap-adapter/create-connection.html)
[8] [https://fusionpractices.com](https://fusionpractices.com/blog/oracle-fusion-invoking-bi-as-webservice/)
[9] [https://community.oracle.com](https://community.oracle.com/customerconnect/discussion/786051/how-to-submit-bip-report-in-oracle-fusion-with-soap-webservice)
[10] [https://bcloudglobalservices.com](https://bcloudglobalservices.com/2026/01/12/how-to-call-bip-report-in-a-vbcs-application/)
[11] [https://medium.com](https://medium.com/@dilipmail4u/generate-a-bip-report-and-save-the-response-to-a-file-using-oic-461a6bd3a45d)
