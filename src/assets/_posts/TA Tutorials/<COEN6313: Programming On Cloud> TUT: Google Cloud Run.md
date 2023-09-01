---
title: "<COEN6313: Programming On Cloud> TUT: Google Cloud Run"
comments: true
tags:
  - Google Cloud Run
---

# <COEN6313: Programming On Cloud> TUT: Google Cloud Run

This tutorial will go through three demo projects for two use cases: (1) [Web services: Websites](https://cloud.google.com/run/#section-6) and (2) [Data processing: Lightweight data transformation](https://cloud.google.com/run/#section-6) using **Google Cloud Run**, **Cloud Storage**, **Eventarc (pronunciation: event arch)**, and **BigQuery** services of the Google Cloud Platform.

Before you dive into the coding, you should study the following materials.

There is no need to operate on the Cloud Run; just understand the concepts and know what you will probably do.

- Cloud Run:

  - Overall:

    - [What is Cloud Run](https://cloud.google.com/run/docs/overview/what-is-cloud-run): You should understand the concept of "Cloud Run Services" and "Clould Run Jobs."

    - [Is my app a good fit for Cloud Run?](https://cloud.google.com/run/docs/fit-for-run): You should know what kind of work suits Google Cloud Run.

  - For Use Case 1:

    - [Quickstart: Deploy to Cloud Run from a Git Repository](https://cloud.google.com/run/docs/quickstarts/deploy-continuously#cloudrun_deploy_continuous_code-python)

    - [Deploy a Python Service to Cloud Run from Source Code](https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-python-service)

  - For Use Case 2:
    - [Use Eventarc to receive events from Cloud Storage](https://cloud.google.com/run/docs/tutorials/eventarc)

- Cloud Storage:
  - [Discover object storage with the Google Cloud console](https://cloud.google.com/storage/docs/discover-object-storage-console)
  - [About Cloud Storage buckets](https://cloud.google.com/storage/docs/buckets)
- Eventarc:
  - [Eventarc overview](https://cloud.google.com/eventarc/docs/overview)
- BigQuery:
  - [What is BigQuery](https://cloud.google.com/bigquery/docs/introduction)

# 1. Preliminary Setup

1. Create a Project Space for your work at https://cloud.google.com/?hl=en.

2. Install the Google Cloud CLI: https://cloud.google.com/sdk/docs/install, run init, and select the project you just created.

   Verify if the tools by the command:

   ```bash
   gcloud -v
   ```

   and you should get the following output:

   ```bash
   Google Cloud SDK 444.0.0
   bq 2.0.97
   core 2023.08.22
   gcloud-crc32c 1.0.0
   gsutil 5.25
   ```

3. Enable Google Cloud APIs:

   ```bash
   gcloud services enable run.googleapis.com \
       eventarc.googleapis.com \
       storage.googleapis.com \
       cloudbuild.googleapis.com
   ```

4. (Optional) Install docker in your local to debug with your Dockerfile.

# 2. Use Case 1: Web Application

There are three approaches to deploying your project as services to Cloud Run:

1. from a published docker image;
2. <u>from a GitHub repository;</u>
3. <u>from your local source code;</u>

This tutorial walks through the last two approaches.

## 2.1 Approach 1: Deploy from a Git Repository

Deploying projects on GitHub to Cloud Run can enable the CI/CD workflow between Google Cloud Platform and GitHub.

You now work on deploying a Python Flask web application to the Cloud Run.

In the root path of this repository, a simple Flash application in the `main.py` and the `Dockerfile` is for Cloud Run Service to build and deploy the image.

The `Dockerfile`:

```dockerfile
# Use the official lightweight Python image.
# https://hub.docker.com/_/python
FROM python:3.11-slim

# Allow statements and log messages to immediately appear in the logs
ENV PYTHONUNBUFFERED True

# Copy local code to the container image.
ENV APP_HOME /app
WORKDIR $APP_HOME
COPY . ./

# Install production dependencies.
RUN pip install --no-cache-dir -r requirements.txt

# Run the web service on container startup. Here we use the gunicorn
# webserver, with one worker process and 8 threads.
# For environments with multiple CPU cores, increase the number of workers
# to be equal to the cores available.
# Timeout is set to 0 to disable the timeouts of the workers to allow Cloud Run to handle instance scaling.
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 main:app

```

In this section, you will focus on the `/` endpoint in the `main.py`:

```python
@app.route("/", methods=['GET', 'POST'])
def hello_world():
    """Example Hello World route."""

    return f"Hello World!!!!!!"
```

Please work on the following steps:

1. Clone this repository.

2. Go to Cloud Run and create a Cloud Run Service:

   1. Click the Cloud Run panel "CREATE SERVICE."

   2. Select "... from a source repository"; Setup Cloud Build; Authorize to your GitHub account; Select the repository you just cloned.

      ![image-20230829103650087](../../img/image-20230829103650087.png)

   3. Select the main branch; Select build type "Dockerfile" and locate the file path `/Dockerfile`.

      <img src="../../img/image-20230829104126827.png" alt="image-20230829104126827" style="zoom:50%;" />

   4. Allow unauthenticated invocations and create the service.

      <img src="../../img/image-20230829104232619.png" alt="image-20230829104232619" style="zoom:50%;" />

3. Your code is now created and deployed on Cloud Run.

   ![84EF0266-791E-472D-8BFE-41EEEF86634B_1_201_a](../../img/84EF0266-791E-472D-8BFE-41EEEF86634B_1_201_a.jpeg)

4. Visit the URL of the `hello_world()` endpoint.

   <img src="../../img/image-20230829105124446.png" alt="image-20230829105124446" style="zoom:50%;" />

5. Make some changes in your code and commit it to the GitHub repository.

   <img src="../../img/image-20230829105322586.png" alt="image-20230829105322586" style="zoom:50%;" />

6. Visit the Build History. You should see a new build is processing.

   <img src="../../img/image-20230829105418670.png" alt="image-20230829105418670" style="zoom: 33%;" />

7. The change should be updated to the web service.

   <img src="../../img/image-20230829105523106.png" alt="image-20230829105523106" style="zoom: 50%;" />

## 2.2 Approach 2: Deploy from Local Source Code using Google Cloud CLI

Sometimes, you may want to deploy your local work to the cloud for debugging. One simple way is to deploy your code using **Google Cloud CLI**.

You now work on deploying a Python Flask web application to the Cloud Run.

In the root path of this repository, a Java application demo in the folder `skier_app_java` contains all necessary Java servlet code and the `skier_app_java/Dockerfile`.

The file builds an image that runs a Java application with Maven.

```dockerfile
FROM maven:3.9.4-eclipse-temurin-11

COPY . ./project
WORKDIR ./project

ENTRYPOINT ["mvn", "clean", "install", "exec:exec", "-Dmaven.test.skip=true"]
```

Please work on the following steps:

1. Once you have installed the CLI tools, you can now deploy this project with the following:

   ```bash
   cd ./skier_app_java
   ```

   And run:

   ```bash
   gcloud run deploy
   ```

2. Follow the prompt: (1) stay default for source code location; (2) stay default for service name; (3) select region; (4) allow unauthenticated invocations.

   ![image-20230829145842650](../../img/image-20230829145842650.png)

This will trigger the Cloud Build first to build your image. On the Cloud Build, you will see:

![image-20230829150235776](../../img/image-20230829150235776.png)

Then, it will create a Cloud Run Service. On the Cloud Run, you will see:

![image-20230829150629404](../../img/image-20230829150629404.png)

You can now visit the [<your_cloudrun_service_url>/coen6731/public/]() to play with the Java Web application.

<img src="../../img/image-20230829150817603.png" alt="image-20230829150817603" style="zoom: 33%;" />

To continually deploy your local changes, you can re-run the `gcloud run deploy` and use the same service name.

# 3. Use Case 2: Automated Data Transformation

To implement the use case, the basic process would be like https://cloud.google.com/eventarc/docs/run/create-trigger-storage-console. But you need to have your **<u>event receiver</u>** that receives the file upload events and hand it to BigQuery. <u>**We deploy a web application with Cloud Run as the receiver.**</u>

## 3.1 Find Out What the Event Message Looks Like

Before that, you need to know <u>how the event has been received and what you will receive</u>.

The following process shows how to figure out the event.

Use the Python app of case 1 to reveal that by adding the following endpoint `event_looks` to the web app on `main.py` as the **<u>event receiver</u>**.

```python
@app.route("/event_looks", methods=['POST'])
def event_looks():
    print(request.method)
    payload = json.loads(request.data)
    print(payload)

    return "Event Received"
```

And deploy it to the Cloud Run as we did in the use case 1.

Then, create a bucket named `cloud_run_tut_bucket`:

<img src="../../img/image-20230829173823630.png" alt="image-20230829173823630" style="zoom: 33%;" />

After that, create an Eventarc trigger named `t1`, select the following event type, link it to the `cloud_run_tut_bucket` storage and the `cloud_run_tut` Run service of endpoint `/event_looks` :

![image-20230831155312625](../../img/image-20230831155312625.png)

For the event type, you should select the following option since uploading a file creates a new object to the bucket:

<img src="../../img/image-20230829175912468.png" alt="image-20230829175912468" style="zoom: 50%;" />

Once the trigger is created, you can find it on the Cloud Run Service page:

![image-20230831155926136](../../img/image-20230831155926136.png)

Upload one PNG file to the bucket, and then you can get the following message from the LOGS of the service.

![image-20230829180753549](../../img/image-20230829180753549.png)

Now you know what is the incoming request from Eventarc.

## 3.2 Receive Events for Data Transformation

Program the Python application to get the uploaded file and store it in the BigQuery by using the API Client Libraries:

- [BigQuery API Client Libraries](https://cloud.google.com/bigquery/docs/reference/libraries)
- [Loading CSV data from Cloud Storage](https://cloud.google.com/bigquery/docs/loading-data-cloud-storage-csv)
- [Cloud Storage Client Libraries](https://cloud.google.com/storage/docs/reference/libraries) (optional)

Before using these libraries, you must set up the authentication: https://cloud.google.com/docs/authentication/client-libraries. If the code runs on Google Cloud Run, it is set by default, and no action is needed.

But if the code runs locally, follow https://cloud.google.com/docs/authentication/provide-credentials-adc#local-dev by just:

```bash
gcloud auth application-default login
```

There are many ways you could do the loading. One way is to use the Storage Client Libraries to download and upload the file with the BigQuery Client Libraries. The other way is to use the BigQuery Client Libraries to create the table directly from a Cloud Storage URL (starts with `gs://`).

Please read:

- [Loading data from Cloud Storage](https://cloud.google.com/bigquery/docs/batch-loading-data#permissions-load-data-from-cloud-storage).
- [Loading CSV data into a table](https://cloud.google.com/bigquery/docs/loading-data-cloud-storage-csv#loading_csv_data_into_a_table)

**<u>The following user scenario is presented</u>**: We upload the IRIS dataset to the bucket with the Console, and we should be able to query all its data in BigQuery.

The `main.py` already has the demo code as endpoint `/event_receive` is shown :

```python
@app.route("/event_receive", methods=['POST'])
def event_receiver():
    payload = json.loads(request.data)

    file_name = payload['name']
    bucket_name = payload['bucket']

    # Construct a BigQuery client object.
    client = bigquery.Client()

    # TODO(developer): Set table_id to the ID of the table to create.
    # table_id = "your-project.your_dataset.your_table_name"
    table_id = f"cloud-tut-397400.cloud_run_tut_dataset.iris"

    job_config = bigquery.LoadJobConfig(
        schema=[
            bigquery.SchemaField("Id", "INT64"),
            bigquery.SchemaField("SepalLengthCm", "FLOAT64"),
            bigquery.SchemaField("SepalWidthCm", "FLOAT64"),
            bigquery.SchemaField("PetalLengthCm", "FLOAT64"),
            bigquery.SchemaField("PetalWidthCm", "FLOAT64"),
            bigquery.SchemaField("Species", "STRING"),
        ],
        skip_leading_rows=1,
        # The source format defaults to CSV, so the line below is optional.
        source_format=bigquery.SourceFormat.CSV,
    )
    uri = f"gs://{bucket_name}/{file_name}"

    load_job = client.load_table_from_uri(
        uri, table_id, job_config=job_config
    )  # Make an API request.

    load_job.result()  # Waits for the job to complete.

    destination_table = client.get_table(table_id)  # Make an API request.
    print("Loaded {} rows.".format(destination_table.num_rows))

    return "Event Received"
```

Note that the `table_id` strictly follows the format `your-project.your_dataset.your_table_name`.

The `your-project` is replaced with the project ID, which can be found while selecting Project in the Console. You may also use the project name.

<img src="../../img/image-20230829215823372.png" alt="image-20230829215823372" style="zoom: 50%;" />

The `your_dataset` is replaced with the dataset name.

The `your_table_name` is the only term we could decide. In this case, it is `iris`.

Then, create a new Eventarc trigger for the endpoint `/event_receive` on the Cloud Run service's TRIGGER panel, similar to what we did before:

![image-20230831161329519](../../img/image-20230831161329519.png)

Create a BigQuery dataset named `cloud_run_tut_dataset` in BigQuery.

<img src="../../img/image-20230829220009774.png" alt="image-20230829220009774" style="zoom: 50%;" />

Now, you can upload the `Iris.csv` file in this repository to the bucket.

<img src="../../img/image-20230829220434392.png" alt="image-20230829220434392" style="zoom:33%;" />

Go to the LOGS of the service. The payload and the number of rows are printed.

<img src="../../img/image-20230829220830791.png" alt="image-20230829220830791" style="zoom: 33%;" />

Finally, you can query the iris data from the created table in BigQuery:

![image-20230829223859264](../../img/image-20230829223859264.png)
