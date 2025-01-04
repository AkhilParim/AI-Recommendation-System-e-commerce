import sys
import os
from dotenv import load_dotenv

from langchain_anthropic import ChatAnthropic
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
                You are a helpful shopping assistant trying to match customers with the right products. Provide as many products as possible that match the customer's question.
                You will be given a question from a customer and some list of prodcuts with the Name, Categories, Ratings of products available for sale that roughly match the customer's question. 
                The output should be in a json format with the following keys: content and products. The content should be a string telling the customer about how the products match their question and the products should be in a list format. Each element should be a json object with the following keys: name, link, image, rating with the respective values.
                If the products does not match the customer's question, look for the most relevant product related to the same/similar category or same product with different specifications and recommend it.
                If the question seems completely unrelated to shopping, say "Sorry, I don't know how to help with that", and include some suggestions for better questions to ask. 

                Example output:
                {{
                    "content": "Here are some products that match your question",
                    "products": [
                        {{
                            "name": "Product 1",
                            "link": "https://www.example.com/product1",
                            "image": "https://www.example.com/product1.jpg",
                            "rating": 4.5
                        }}
                    ]
                }}

                Donot include any other text in your response.
                Donot include any other keys in your response.
                If you donot have any products that match the customer's question, return an empty list.

                Here is the customer question: {question}

                Here are the products you can use to generate a response:
                {products}
            """

    prompt = PromptTemplate.from_template(prompt)
    # llm = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    llm = ChatAnthropic(model="claude-3-5-sonnet-20240620", api_key=os.getenv("ANTHROPIC_API_KEY"))
    
    chain = prompt | llm
    output = chain.invoke({"question": product_name, "products": [text.page_content for text in products]})
    return output.content

if __name__ == "__main__":
    product_name = sys.argv[1]
    print(get_recommendations(product_name))