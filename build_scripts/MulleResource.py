class MulleResource:
    def __init__(self, name):

        self.name = name
        self.files = []

        self.opaque = False

    def addFile(self, opt):
        if (type(opt['num']) is str and '-' in opt['num']) or type(opt['num']) == list:
            if type(opt['num']) == list:
                files = opt['num']
            else:
                files = opt['num'].split('-')

            for i in range(int(files[0]), int(files[1]) + 1):
                self.addFile({'dir': opt['dir'], 'lib': opt['lib'], 'num': i})

        else:
            self.files.append(opt)
