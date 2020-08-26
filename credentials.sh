client_id=$(curl -H "Authorization: Basic $BASE64=" "https://api.enterprise.apigee.com/v1/organizations/emea-demo8/apiproducts/Cicd-Product?query=list&entity=keys")

id=$(jq -r .[0] <<< "${client_id}" )
echo $id

client_secret=$(curl -H "Authorization: Basic $BASE64=" "https://api.enterprise.apigee.com/v1/organizations/emea-demo8/developers/smart-comm@api.com/apps/smart-comm-app/keys/$id")

secret=$(jq -r .consumerSecret <<< "${client_secret}" )
echo $sec