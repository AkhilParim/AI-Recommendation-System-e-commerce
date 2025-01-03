import sys
import os
from dotenv import load_dotenv

from langchain_openai import OpenAI
from langchain_core.prompts import PromptTemplate
from langchain_qdrant import QdrantVectorStore
from langchain_openai import OpenAIEmbeddings

load_dotenv()

def get_recommendations(product_name):
    vector_embeddings = OpenAIEmbeddings(api_key=os.getenv("OPENAI_API_KEY"), model="text-embedding-3-large")
    qdrant = QdrantVectorStore.from_existing_collection(
        embedding=vector_embeddings,
        collection_name="e-commerce AI Recommendation System",
        url=os.getenv("QDRANT_URL"),
        api_key=os.getenv("QDRANT_API_KEY")
    )

    products = qdrant.similarity_search(product_name, k=10)
    prompt = """
                You are a helpful shopping assistant trying to match customers with the right product.
                You will be given a question from a customer and some list of prodcuts with the Name, Categories, Ratings of products available for sale that roughly match the customer's question. 
                Respond in HTML markup, with an anchor tag at the end with images that link to the product pages and <br /> tags between your text response and product recommendations.
                The anchor should be of the format: <a href={{link}} target="_blank”>{{name}}<img style={{border: "1px black solid"}} width="200px" src={{image}} /></a> but with the name, link, and image replaced with passed-in variables. 
                If you have recommended products, end your response with "Click on a product to learn more!". If you are unsure or if the question seems unrelated to shopping, say "Sorry, I don't know how to help with that", and include some suggestions for better questions to ask. 

                Here is the customer question: {question}

                Here are the products you can use to generate a response:
                {products}
            """

    prompt = PromptTemplate.from_template(prompt)
    llm = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    chain = prompt | llm
    output = chain.invoke({"question": product_name, "products": [text.page_content for text in products]})
    return output

if __name__ == "__main__":
    if len(sys.argv) > 1:
        product_name = sys.argv[1]
        print(get_recommendations(product_name))
    else:
        print("Please provide a product name as an argument")