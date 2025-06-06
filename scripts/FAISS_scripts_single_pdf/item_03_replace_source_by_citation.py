import os
import sys
from dotenv import load_dotenv, find_dotenv
import pandas as pd
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings

# Load environment variables
load_dotenv(find_dotenv())

def replace_sources(course_dir):
    # Validate existence of Course directory
    if not os.path.isdir(course_dir):
        print(f"The provided path is not a valid directory: {course_dir}")
        sys.exit(1)

    # Initialize OpenAI embeddings
    embedding = OpenAIEmbeddings(api_key=os.getenv("OPENAI_API_KEY"))

    # Load the FAISS index
    vectordb = FAISS.load_local(course_dir, embedding, allow_dangerous_deserialization=True)

    # Load the CSV file with sources and references
    csv_filename = os.path.join(course_dir, "additional_files", "citations.csv")
    if not os.path.isfile(csv_filename):
        print(f"Error: Citations CSV file not found at: {csv_filename}")
        sys.exit(1)
    citations_df = pd.read_csv(csv_filename)

    # Create a dictionary for quick lookup
    source_to_reference = dict(zip(citations_df['Source'], citations_df['Reference']))

    # Get all keys from the vector database
    all_keys = list(vectordb.docstore.__dict__['_dict'].keys())

    # Function to replace source with reference
    def replace_source_with_reference(doc):
        original_source = doc.metadata["source"]
        if original_source in source_to_reference:
            doc.metadata["source"] = source_to_reference[original_source]
        return doc

    # Iterate through all documents and replace the source with the reference
    for key in all_keys:
        vectordb.docstore.__dict__['_dict'][key] = replace_source_with_reference(
            vectordb.docstore.__dict__['_dict'][key]
        )

    # Save the modified vectordb to local
    vectordb.save_local(course_dir)

    print(f"Sources in the FAISS database have been replaced with their corresponding references.")

    # Optionally, verify a few entries
    # This should show chunks with the same citation when using a single PDF
    # print("\nVerifying a few entries:")
    # for i in range(min(5, len(all_keys))):
    #   print(f"Document {i + 1} source:", vectordb.docstore.__dict__['_dict'][all_keys[i]].metadata["source"])