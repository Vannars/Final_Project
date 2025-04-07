from transformers import AutoModelWithLMHead, AutoTokenizer
import spacy
import json # json dumps - formatting for the output
import uuid # unique ids 

# Load spaCy model
nlp = spacy.load("en_core_web_sm") # loads the tokenizer for english

tokenizer = AutoTokenizer.from_pretrained("mrm8488/t5-base-finetuned-question-generation-ap") # a tokenizer is a class used for converting strings to lists of tkens
model = AutoModelWithLMHead.from_pretrained("mrm8488/t5-base-finetuned-question-generation-ap") 

def get_question(answer, context, max_length=250):
    input_text = "answer: %s  context: %s </s>" % (answer, context) # string template (answer, context replaces %s)
    features = tokenizer([input_text], return_tensors='pt') 

    output = model.generate(input_ids=features['input_ids'], 
                            attention_mask=features['attention_mask'], # attention mask - pads inputs to the same length
                            max_length=max_length) # max length is max_length defined in tha parameter
                            

    return tokenizer.decode(output[0]) # output a string from the first element of the output array

context = "Manuel has created RuPERTa-base with the support of HF-Transformers and Google"
answer = "Manuel"


# Original version ===================================={
question = get_question(answer, context)
print("")
print("Generated question:", question)

# Process the context with spaCy
doc = nlp(context)
for token in doc:
    print(token.text, token.pos_, token.dep_)
# output: question: Who created the RuPERTa-base?
#Original version =====================================}



#GET SETENCES FUNCTION
def get_sentences(text): 
    doc = nlp(text) #ref link: https://spacy.io/api/doc
    sentences = list(doc.sents) # sent comes from the sentencizer class https://spacy.io/api/sentencizer (iterates from the default boundary which is a period ".")
    return [s.text for s in sentences] # returning sentences for all elements that have a .text attribute (hopefully all of them) 
#Test
if __name__ == "__main__": # ref link: https://www.geeksforgeeks.org/what-does-the-if-__name__-__main__-do/)
    text = "The PlayStation 5 (PS5) is Sony's latest gaming console. It features a custom SSD for fast loading."
    sentences = get_sentences(text)
    for s in sentences:
        print(s)
    #output: ['The PlayStation 5 (PS5) is Sony's latest gaming console.', 'It features a custom SSD for fast loading.'] Successfull

#GEN QUESIONS FUNCTION (EXTENTION OF GET QUESTION FUNCTION)
def gen_questions(text):
    questions = []
    sentences = get_sentences(text)
    for s in sentences:
        question = (get_question(s, text))
        questions.append(question)
    return questions

def gen_questions_hierarchial(text):
    sentences = get_sentences(text)
    children = []
    for s in sentences:
        question = get_question(s, text)
        children.append({
            "Question": question,
            "Answer": s,
            "QAID": str(uuid.uuid4()),
            "children": []
        })
    return children

#Test
if __name__ == "__main__":
    test_context = "The human heart can pump enough pressure to squirt blood 30 feet, and there are more than 1,700 references to gems and precious stones in the King James translation of the Bible. Diet Coke was only invented in 1982, and if you had enough water to fill one million goldfish bowls, you could fill an entire stadium. The average person makes about 1,140 telephone calls each year, and the Australian $5 to $100 notes are made of plastic. "
   
   # OLD VERSION (not heierarchical)
   # questions = gen_questions(test_context)
    #for s, q in zip(get_sentences(test_context), questions): # looping over setences (s) and questions (q) in zip (saving memory)
     #   print(f"Test Sentence (Answer): {s}")
      #  print(f"Generated response (Question): {q}\n")
    #result= {"context": test_context, "qa_pairs": questions}
        #End OLD VERSION

      # NEW VERSION (heierarchical)
    children = gen_questions_hierarchial(test_context)
    result = {
        "Question": "Root",
        "QAID": "Root",
        "children": children,
    }    
    print(json.dumps(result, indent=4))
# CITATION

#THIS IS THE CITATION FOR THE T5 MODEL USED IN THE QUESTION GENERATION COMPONENT
# THIS CODE HAS BEEN HEAVILY MODIFIED IN ORDER TO FIT THE NEEDS OF THE PROJECT
# THE ORIGINAL CODE CAN BE FOUND AT: https://huggingface.co/mrm8488/t5-base-finetuned-question-generation-ap
# THE ORIGINAL CODE WAS WRITTEN BY MANUEL ROMERO
# THE ORIGINAL CODE IS LICENSED UNDER THE APACHE 2.0 LICENSE
# THE ORIGINAL CODE WAS PUBLISHED ON THE HUGGING FACE HUB
# THE ORIGINAL CODE WAS PUBLISHED IN 2021

#@misc{mromero2021t5-base-finetuned-question-generation-ap,
#   title={T5 (base) fine-tuned on SQUAD for QG via AP},
#   author={Romero, Manuel},
#   publisher={Hugging Face},
#   journal={Hugging Face Hub},
#   howpublished={\url{https://huggingface.co/mrm8488/t5-base-finetuned-question-generation-ap}},
#   year={2021}
# }
