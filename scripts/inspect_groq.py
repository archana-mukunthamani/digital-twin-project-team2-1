import inspect
try:
    import groq
    from groq import Groq
    print('MODULE_FILE:', inspect.getsourcefile(groq))
    print('VERSION:', getattr(groq, '__version__', None))
    print('HAS_Groq:', hasattr(groq, 'Groq'))
    try:
        print('Groq.signature:', inspect.signature(Groq))
    except Exception as e:
        print('Groq.signature_error:', e)
    try:
        print('Groq.sourcefile:', inspect.getsourcefile(Groq))
    except Exception as e:
        print('Groq.sourcefile_error:', e)
except Exception as e:
    print('IMPORT_ERROR:', e)
