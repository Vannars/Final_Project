from transformers import AutoModelWithLMHead, AutoTokenizer
import spacy

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
    sentence = get_sentences(text)
    print(sentence)
    #output: ['The PlayStation 5 (PS5) is Sony's latest gaming console.', 'It features a custom SSD for fast loading.'] Successfull

#GEN QUESIONS FUNCTION (EXTENTION OF GET QUESTION FUNCTION)
def gen_questions(text):
    questions = []
    sentences = get_sentences(text)
    for s in sentences:
        questions.append(get_question(s, text))
        return questions
#Test
if __name__ == "__main__":
    context = "The PlayStation 5 (PS5) is Sony's latest gaming console. It features a custom SSD for fast loading."
    questions = gen_questions(context)
    for q in questions:
        print(q)
# CITATION

#THIS IS THE CITATION FOR THE T5 MODEL USED IN THE QUESTION GENERATION COMPONENT
# THIS CODE HAS BEEN HEAVIL MODIFIED IN ORDER TO FIT THE NEEDS OF THE PROJECT
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
