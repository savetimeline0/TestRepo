Customer send request in our inbound api and we will store that data in db and send them to acknowledge we have recived that data.


Primary Protected WSDL (Recommended):
https://<your_fusion_base_url>/xmlpserver/services/ExternalReportWSSService?WSDL

Public/V2 Alternative:
https://<your_fusion_base_url>/xmlpserver/services/v2/ReportService?WSDL


ExternalReportWSSService 

runreport > reportrequest > parametervalue > [item] -> name, values > [item = value]
                          > reportAbsolutePath
                          > sizeofDatachunk


Choose stage operation : Read Entire File
decodebase64ToRefrence(reportBytes)


Oracle ERP Cloud    