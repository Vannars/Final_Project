from transformers import AutoModelWithLMHead, AutoTokenizer
import spacy

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

tokenizer = AutoTokenizer.from_pretrained("mrm8488/t5-base-finetuned-question-generation-ap")
model = AutoModelWithLMHead.from_pretrained("mrm8488/t5-base-finetuned-question-generation-ap")

def get_question(answer, context, max_length=64):
    input_text = "answer: %s  context: %s </s>" % (answer, context)
    features = tokenizer([input_text], return_tensors='pt')

    output = model.generate(input_ids=features['input_ids'], 
                            attention_mask=features['attention_mask'],
                            max_length=max_length)

    return tokenizer.decode(output[0])

context = "Manuel has created RuPERTa-base with the support of HF-Transformers and Google"
answer = "Manuel"

question = get_question(answer, context)
print("Generated question:", question)

# Process the context with spaCy
doc = nlp(context)
for token in doc:
    print(token.text, token.pos_, token.dep_)

# output: question: Who created the RuPERTa-base?


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
