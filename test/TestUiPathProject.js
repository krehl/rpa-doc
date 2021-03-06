import { UiPathProject } from "../app/UiPathProject.js";

import * as assert from "assert";
import * as path from "path";

/**
 * Test the UiPathProject object.
 */
describe( "UiPathProject", function() {

  /**
   * Test constructing a new instance of the class.
   */
  describe( "#constructor", function() {
    it( "should throw an error if the parameter is not supplied", function() {
      assert.throws( function() {
      new UiPathProject();
    }, TypeError );
  } );

  it( "should throw an error if the parameter is not a string", function() {
    assert.throws( function() {
      new UiPathProject( new Object );
    }, TypeError );
  } );

  it( "should return an object when a project.json file can be found in the given path", function() {
    let projectInfo = new UiPathProject( "./test/artefacts" );
    assert.strictEqual( typeof( projectInfo ), "object" );
  } );

  it( "should throw an error if the project.json file cannot be read", function() {
    assert.throws( function() {
      new UiPathProject( "./test" );
    }, Error );
  } );
} );

  /**
   * Test getting the name of the UiPath project.
   */
  describe( "#getName", function() {
    it( "should return a string", function() {
      let projectInfo = new UiPathProject( "./test/artefacts" );
      assert.strictEqual( typeof( projectInfo.getName() ), "string" );
    } );

    it( "should return a name that matches what is in the JSON file", function() {
      let projectInfo = new UiPathProject( "./test/artefacts" );
      assert.strictEqual( projectInfo.getName(), "Flinders.Foundation" );
    } );

    it( "should return an empty string when name property is missing", function() {
      let projectInfo = new UiPathProject( "./test/artefacts" );
      projectInfo.fileContents = {};
      assert.strictEqual( projectInfo.getName(), "" );
    } );
  } );

  /**
   * Test getting the description of the UiPath project.
   */
  describe( "#getDescription", function() {
    it( "should return a string", function() {
      let projectInfo = new UiPathProject( "./test/artefacts" );
      assert.strictEqual( typeof( projectInfo.getDescription() ), "string" );
    } );

    it( "should return a description that matches what is in the JSON file", function() {
      let projectInfo = new UiPathProject( "./test/artefacts" );
      assert.strictEqual( projectInfo.getDescription(), "The Flinders.Foundation library contains foundational workflows for use across all processes" );
    } );

    it( "should return an empty string when description property is missing", function() {
      let projectInfo = new UiPathProject( "./test/artefacts" );
      projectInfo.fileContents = {};
      assert.strictEqual( projectInfo.getDescription(), "" );
    } );
  } );

  /**
   * Test getting the version of the UiPath project.
   */
  describe( "#getVersion", function() {
    it( "should return a string", function() {
      let projectInfo = new UiPathProject( "./test/artefacts" );
      assert.strictEqual( typeof( projectInfo.getVersion() ), "string" );
    } );

    it( "should return a version that matches what is in the JSON file", function() {
      let projectInfo = new UiPathProject( "./test/artefacts" );
      assert.strictEqual( projectInfo.getVersion(), "2.0.0-alpha" );
    } );

    it( "should return an empty string when projectVersion property is missing", function() {
      let projectInfo = new UiPathProject( "./test/artefacts" );
      projectInfo.fileContents = {};
      assert.strictEqual( projectInfo.getVersion(), "" );
    } );
  } );

  /**
   * Test determining if this is a library project or not.
   */
  describe( "#isLibrary", function() {
    it( "should return a boolean", function() {
      let projectInfo = new UiPathProject( "./test/artefacts" );
      assert.strictEqual( typeof( projectInfo.isLibrary() ), "boolean" );
    } );

    it( "should return true if this is a library project", function() {
      let projectInfo = new UiPathProject( "./test/artefacts" );
      assert.strictEqual(  projectInfo.isLibrary(), true );
    } );

    it( "should return false if this is not a library project", function() {
      let projectInfo = new UiPathProject( "./test/artefacts" );
      projectInfo.fileContents.projectType = "Workflow";
      assert.strictEqual( projectInfo.isLibrary(), false );
    } );

    it( "should return false if the projectType property is missing", function() {
      let projectInfo = new UiPathProject( "./test/artefacts" );
      projectInfo.fileContents = {};
      assert.strictEqual( projectInfo.isLibrary(), false );
    } );
  } );

  /**
   * Test getting a list of private workflows.
   */
  describe( "#getPrivateWorkflows", function() {
    it( "should return an array", function() {
      let projectInfo = new UiPathProject( "./test/artefacts" );
      assert.ok( Array.isArray( projectInfo.getPrivateWorkflows() ) );
    } );

    it( "should return an array of 19 elements", function() {
      let projectInfo = new UiPathProject( "./test/artefacts" );
      assert.ok( Array.isArray( projectInfo.getPrivateWorkflows() ) );
      assert.strictEqual( projectInfo.getPrivateWorkflows().length, 19 );
    } );

    it( "should return an empty array if the element in the JSON file is empty", function() {
      let projectInfo = new UiPathProject( "./test/artefacts" );
      projectInfo.fileContents.libraryOptions.privateWorkflows = [];
      assert.ok( Array.isArray( projectInfo.getPrivateWorkflows() ) );
      assert.strictEqual( projectInfo.getPrivateWorkflows().length, 0 );
    } );

    it( "should return an empty array if the element in the JSON file is not an array", function() {
      let projectInfo = new UiPathProject( "./test/artefacts" );
      projectInfo.fileContents.libraryOptions.privateWorkflows = {};
      assert.ok( Array.isArray( projectInfo.getPrivateWorkflows() ) );
      assert.strictEqual( projectInfo.getPrivateWorkflows().length, 0 );
    } );

    it( "should return an empty array if the element is missing", function() {
      let projectInfo = new UiPathProject( "./test/artefacts" );
      delete projectInfo.fileContents.libraryOptions.privateWorkflows;
      assert.ok( Array.isArray( projectInfo.getPrivateWorkflows() ) );
      assert.strictEqual( projectInfo.getPrivateWorkflows().length, 0 );

      delete projectInfo.fileContents.libraryOptions;
      assert.ok( Array.isArray( projectInfo.getPrivateWorkflows() ) );
      assert.strictEqual( projectInfo.getPrivateWorkflows().length, 0 );
    } );
  } );

  /**
   *  Test getting a list of NuGet dependencies.
   */
  describe( "#getDependencies", function() {
    it( "should return a Map object", function() {
      let projectInfo = new UiPathProject( "./test/artefacts" );
      assert.ok( projectInfo.getDependencies() instanceof Map );
    } );

    it( "should return a Map with five entries", function() {
      let projectInfo = new UiPathProject( "./test/artefacts" );
      assert.strictEqual( projectInfo.getDependencies().size, 6 );
    } );

    it( "should contain the expected list of dependencies", function() {
      const expected = [
        "Flinders.Foundation.Testing",
        "UiPath.Credentials.Activities",
        "UiPath.Excel.Activities",
        "UiPath.Mail.Activities",
        "UiPath.System.Activities",
        "UiPath.UIAutomation.Activities"
      ];

      const versions = [
        "1.0.1-alpha.5",
        "1.1.6479.13204",
        "2.6.2",
        "1.5.0",
        "19.6.0",
        "19.6.0"
      ];

      let projectInfo = new UiPathProject( "./test/artefacts" );
      let actual = projectInfo.getDependencies();

      expected.forEach( function( value, index ) {

        assert.ok( actual.has( value ) );
        // eslint-disable-next-line security/detect-object-injection
        assert.ok( actual.get( value ) === versions[ index ] );

      } );
    } );
  } );

  /**
   * Test getting the project path.
   */
  describe( "#getProjectPath", function() {
    it( "should return a string", function() {
      let projectInfo = new UiPathProject( "./test/artefacts" );

      let projectPath = projectInfo.getProjectPath();

      assert.strictEqual( typeof projectPath, "string" );
    } );

    it( "should return an absolute path", function() {
      let projectInfo = new UiPathProject( "./test/artefacts" );

      assert.ok( path.isAbsolute( projectInfo.getProjectPath() ) );
    } );

    it( "should return a path that is consistent with the constructor", function() {
      let projectInfo = new UiPathProject( "./test/artefacts" );

      assert.strictEqual(
        projectInfo.getProjectPath(),
        path.resolve( "./test/artefacts" )
      );
    } );
  } );

  /**
   * Test getting a list of XAML files.
   */
  describe( "#getXamlFiles", function() {
    it( "should return an array of XAML files", function() {
      let projectInfo = new UiPathProject( "./test/artefacts" );

      assert.ok( Array.isArray( projectInfo.getXamlFiles() ) );

    } );

    it( "should return an array of one element", function() {
      let projectInfo = new UiPathProject( "./test/artefacts" );

      let xamlFiles = projectInfo.getXamlFiles();

      assert.ok( Array.isArray( xamlFiles ) );
      assert.strictEqual(
        xamlFiles.length,
        1
      );

      assert.ok( xamlFiles[ 0 ].endsWith( "uno.xaml" ) );

      xamlFiles = projectInfo.getXamlFiles( false );

      assert.ok( Array.isArray( xamlFiles ) );
      assert.strictEqual(
        xamlFiles.length,
        1
      );

      assert.ok( xamlFiles[ 0 ].endsWith( "uno.xaml" ) );
    } );

    it( "should return an array of two elements when recursive is true", function() {
      let projectInfo = new UiPathProject( "./test/artefacts" );

      let xamlFiles = projectInfo.getXamlFiles( true );

      assert.ok( Array.isArray( xamlFiles ) );
      assert.strictEqual(
        xamlFiles.length,
        2
      );
    } );

    it( "should return an array with no elements when recursive is false and private is true", function() {
      let projectInfo = new UiPathProject( "./test/artefacts" );
      projectInfo.fileContents.libraryOptions.privateWorkflows = [ "uno.xaml" ];

      let xamlFiles = projectInfo.getXamlFiles( false, true );

      assert.ok( Array.isArray( xamlFiles ) );
      assert.strictEqual(
        xamlFiles.length,
        0
      );
    } );

    it( "should return an array with one elements when recursive is true and private is true", function() {
      let projectInfo = new UiPathProject( "./test/artefacts" );
      projectInfo.fileContents.libraryOptions.privateWorkflows = [ "uno.xaml" ];

      let xamlFiles = projectInfo.getXamlFiles( true, true );

      assert.ok( Array.isArray( xamlFiles ) );
      assert.strictEqual(
        xamlFiles.length,
        1
      );
      assert.ok( xamlFiles[ 0 ].endsWith( "dos.xaml" ) );
    } );
  } );
} );
