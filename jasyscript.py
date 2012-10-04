#
# This is the jasyscript.py of $${name} file. 
# This file defines tasks for the Jasy build tool we use for development and deployment of $${name}.
#

@task
def clean():
    """Clear build cache"""
    
    session.clean()
    Repository.clean()


@task
def distclean():
    """Clear caches and build results"""
    
    session.clean()
    Repository.distclean()


@task
def api():
    """Build API viewer"""
    
    Task.runTask("apibrowser", "build")
    ApiWriter(session).write("$prefix/data")
    
    
@task
def server():
    """Start HTTP server"""
    
    Server().start()


@task
def source():
    """Generate source (development) version"""

    # Initialize shared objects
    assetManager = AssetManager(session).addSourceProfile()
    outputManager = OutputManager(session, assetManager, compressionLevel=0, formattingLevel=1)
    fileManager = FileManager(session)
    
    # Store kernel script
    outputManager.storeKernel("$prefix/script/kernel.js", debug=True)
    
    # Process every possible permutation
    for permutation in session.permutate():

        # Resolving dependencies
        classes = Resolver(session).addClassName("$${name}.Main").getSortedClasses()
        
        # Writing source loader
        outputManager.storeLoader(classes, "$prefix/script/$${name}-$permutation.js", "new $${name}.Main;")


@task
def build():
    """Generate deployable and combined build version"""

    # Initialize shared objects
    assetManager = AssetManager(session).addBuildProfile()
    outputManager = OutputManager(session, assetManager, compressionLevel=0)
    fileManager = FileManager(session)

    # Deploy assets
    outputManager.deployAssets(["$${name}.Main"])

    # Copy files from source
    copyFiles = [
        "index.html",
        "404.html",
        "apple-touch-icon-57x57-precomposed.png",
        "apple-touch-icon-72x72-precomposed.png",
        "apple-touch-icon-114x114-precomposed.png",
        "apple-touch-icon-144x144-precomposed.png",
        "apple-touch-icon-precomposed.png",
        "apple-touch-icon.png",
        "favicon.ico",
        "humans.txt",
        "robots.txt",
        "vendor/jquery-1.8.2.min.js",
        "vendor/modernizr-2.6.2.min.js",
        "vendor/plugins.js",
        "vendor/main.css",
        "vendor/normalize.css"
    ]
    for f in copyFiles:
        fileManager.updateFile("source/" + f, "$prefix/" + f)

    # Write kernel script
    outputManager.storeKernel("$prefix/script/kernel.js", debug=True)

    # Process every possible permutation
    for permutation in session.permutate():

        # Resolving dependencies
        classes = Resolver(session).addClassName("$${name}.Main").getSortedClasses()

        # Compressing classes
        outputManager.storeCompressed(classes, "$prefix/script/$${name}-$permutation.js", "new $${name}.Main;")

