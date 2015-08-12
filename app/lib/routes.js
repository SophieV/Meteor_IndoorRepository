Router.configure({
  layoutTemplate: 'MasterLayout',
  loadingTemplate: 'Loading',
  notFoundTemplate: 'NotFound'
});

Router.route('/', {
  name: 'home',
  controller: 'HomeController',
  action: 'action',
  where: 'client'
});

Router.route('/signs', {
  name: 'signs',
  controller: 'SignsController',
  action: 'index',
  where: 'client'
});

Router.route('/sign-add', {
  name: 'sign-add',
  controller: 'SignsController',
  action: 'add',
  where: 'client'
});

Router.route('/projects', {
  name: 'projects',
  controller: 'ProjectsController',
  action: 'index',
  where: 'client'
});

Router.route('/project-add', {
  name: 'project-add',
  controller: 'ProjectsController',
  action: 'add',
  where: 'client'
});

Router.route('/project-set', {
  name: 'project-set',
  controller: 'ProjectsController',
  action: 'set',
  where: 'client'
});

Router.route('pdf', {
  where: 'server',
  path: '/pdf/:path/:file',
  action: function() {
    var fn = this.params.file.replace(/\.pdf$/, '-' + this.params.path + '.pdf');
    var data;
    try {
        data = fs.readFileSync('/opt/downloads/' + fn);
      } catch(err) {
        this.response.writeHead(404);
        this.response.end('Error 404 - Not found.');
        return;
      }

      var headers = {
        'Content-type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename=' + this.params.file
      };
    this.response.writeHead(200, headers);
    this.response.end(data);
  }
});

Router.route('zip', {
  where: 'server',
  path: 'zip',
  waitOn: function() {
    return Meteor.subscribe('all_signs_publication');
  },
  action: function() {
    var self = this;

    // Create zip
    // var JSZip = Meteor.npmRequire('jszip');
    var zip = new JSZip();

    // Add a file to the zip
    zip.file('signs.txt', Signs.find({}).fetch());

    // Generate zip stream
    var output = zip.generate({
      type:        "nodebuffer",
      compression: "DEFLATE"
    });

    // Set headers
    self.response.setHeader("Content-Type", "application/octet-stream");
    self.response.setHeader("Content-disposition", "attachment; filename=signs.zip");
    self.response.writeHead(200);

    // Send content
    self.response.end(output);
  }
});