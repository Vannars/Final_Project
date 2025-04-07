from transformers import AutoModelWithLMHead, AutoTokenizer
import spacy
from spacy.language import Language 
import json # json dumps - formatting for the output
import uuid # unique ids 
from collections import defaultdict

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


#============================================================================= Original version ===================================={


# Generate a question just based on the answer 
def regenerate_question_from_answer_only(answer, max_length=64):
    input_text = f"Generate a question that could be answered by: {answer}"
    input_ids = tokenizer.encode(input_text, return_tensors="pt")
    output = model.generate(input_ids=input_ids, max_length=max_length)
    return tokenizer.decode(output[0], skip_special_tokens=True)

context = "Manuel has created RuPERTa-base with the support of HF-Transformers and Google"
answer = "Manuel"

question = get_question(answer, context)
print("")
print("Generated question:", question)

# Process the context with spaCy
doc = nlp(context)
for token in doc:
    print(token.text, token.pos_, token.dep_)
# output: question: Who created the RuPERTa-base?
#===============================================================================Original version END=====================================}


#=============================================================================MY VERSION (MODIFIED) ==================================================================================
@Language.component("custom_boundaries")
def custom_boundaries(doc):
        for token in doc[:-1]:
            if token.text == ".": # the default period boundary
                doc[token.i + 1].is_sent_start = True
            if token.text == "," and token.nbor(1).text == "and": # oxford comma boundary
                doc[token.i + 1].is_sent_start = True
        return doc

def format_context(answer):
    answer = answer.strip()
    if answer.lower().startswith("and"):
        answer = answer[4:]
    if len(answer) > 0 and not answer[0].isupper():
        answer = answer[0].upper() + answer[1:]
    return answer


def split_sentence(sentence):
    split_sentences = []
    sections = sentence.split(", and")
    for section in sections:
        split_sentences.extend(section.split(", "))
    return [s.strip() for s in split_sentences if s.strip()]


def split_facts(sentence):
    sections = sentence.split(", and")
    return [s.strip() for s in sections if s.strip()]

#Extracting the best phrase from the context from block
def extract_fact(block):
    doc = nlp(block)
    nouns = [token.text for token in doc if token.pos_ in ("NOUN", "PROPN") and token.dep_ != "det"] # nouns and proper nouns
    numbers = [token.text for token in doc if token.pos_ == "NUM"] # numbers
    if numbers:
        return block # if numbers it is a block
    if nouns:
        return block # if nounds it is a block
    return block # otherwise the whole thing is a block

#GET SENTENCES FUNCTION
def get_sentences(text): 
    #Setting a custom boundar to be used by the sentencizer 
    if "custom_boundaries" not in nlp.pipe_names:
        nlp.add_pipe("custom_boundaries", before="parser")

    doc = nlp(text) #ref link: https://spacy.io/api/doc
    sentences = list(doc.sents) # sent comes from the sentencizer class https://spacy.io/api/sentencizer (iterates from the default boundary which is a period ".")
    optimised_sentences = []
    for s in sentences:
        optimised_sentences.extend(split_sentence(s.text))
    return optimised_sentences # returning sentences for all elements that have a .text attribute (hopefully all of them) 


#GEN QUESIONS FUNCTION 
def gen_questions(text):
    questions = []
    sentences = get_sentences(text)
    for s in sentences:
        question = (get_question(s, text))
        questions.append(question)
    return questions

#HEIRARCHIAL GEN 
def gen_questions_hierarchial(text):
    sentences = get_sentences(text) # take sentences from the text
    analysed_s = set() # set to track analysed sentences
    children = [] # list to store children (Q and A pairs)
    seen_questions = defaultdict(int) # tracks duplicates

    for s in sentences: # looking at each sentence
        cleaned_s = s.strip() # remove whitsespace from back and front
        if len(cleaned_s) < 10 or cleaned_s in analysed_s: # short or dublicates skipped 
            continue
        analysed_s.add(cleaned_s) # add cleaned setence to analysed_s set

        # Set Question as a generated question from cleaned_s and text (context)
        q_unclean = get_question(cleaned_s, text).replace("<pad> question: ", "").replace("</s>", "").strip()

        # Format answer
        answer = format_context(cleaned_s)

        # Detect and regenerate if answer is weak
        if len(answer.split()) < 4 or answer.endswith(","):
            q_unclean = regenerate_question_from_answer_only(answer)

        # Handle repeated questions
        seen_questions[q_unclean] += 1
        if seen_questions[q_unclean] > 1:
            q_unclean = f"What else {q_unclean[0].lower() + q_unclean[1:]}"  # esentially this changes postion 0 to lower case and adds "What else" to the start of the question and continues from position 1: onwards

        # Appending a cleaned question + answer
        children.append({
            "Question": f"<pad> question: {q_unclean}</s>", #
            "Answer": answer,
            "QAID": str(uuid.uuid4()),
            "children": []
        })
    return children

#Test
if __name__ == "__main__":
    test_context = "Much Ado About Nothing is a Shakespearean comedy that revolves around two romantic pairings in the Sicilian town of Messina. The first couple, Claudio and Hero, fall in love quickly and plan to marry, but their relationship is nearly ruined by the scheming Don John, who tricks Claudio into thinking Hero has been unfaithful. Meanwhile, the witty and sharp-tongued Beatrice and Benedick engage in a 'merry war' of words, both swearing off love until their friends conspire to trick them into falling for each other. Through misunderstandings, deception, and comic relief, the truth eventually comes to light, and both couples are happily united."
   
    # OLD VERSION (not heierarchical)
    # questions = gen_questions(test_context)
    # for s, q in zip(get_sentences(test_context), questions): # looping over setences (s) and questions (q) in zip (saving memory)
    #     print(f"Test Sentence (Answer): {s}")
    #     print(f"Generated response (Question): {q}\n")
    # result= {"context": test_context, "qa_pairs": questions}
    # End OLD VERSION

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
