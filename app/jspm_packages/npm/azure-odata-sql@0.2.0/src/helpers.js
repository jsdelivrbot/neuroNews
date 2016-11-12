/* */ 
var types = require('./utilities/types'),
    strings = require('./utilities/strings');
var helpers = module.exports = {
  isValidIdentifier: function(identifier) {
    if (!identifier || !types.isString(identifier) || identifier.length > 128) {
      return false;
    }
    for (var i = 0; i < identifier.length; i++) {
      var char = identifier[i];
      if (i === 0) {
        if (!(strings.isLetter(char) || (char == '_'))) {
          return false;
        }
      } else {
        if (!(strings.isLetter(char) || strings.isDigit(char) || (char == '_'))) {
          return false;
        }
      }
    }
    return true;
  },
  validateIdentifier: function(identifier) {
    if (!this.isValidIdentifier(identifier)) {
      throw new Error(identifier + " is not a valid identifier. Identifiers must be under 128 characters in length, start with a letter or underscore, and can contain only alpha-numeric and underscore characters.");
    }
  },
  formatTableName: function(schemaName, tableName) {
    this.validateIdentifier(tableName);
    if (schemaName !== undefined) {
      schemaName = module.exports.formatSchemaName(schemaName);
      this.validateIdentifier(schemaName);
      return '[' + schemaName + '].[' + tableName + ']';
    }
    return '[' + tableName + ']';
  },
  formatSchemaName: function(appName) {
    return appName.replace(/-/g, '_');
  },
  formatMember: function(memberName) {
    this.validateIdentifier(memberName);
    return '[' + memberName + ']';
  },
  getSqlType: function(value, primaryKey) {
    if (value === undefined || value === null)
      throw new Error('Cannot create column for null or undefined value');
    switch (value.constructor) {
      case String:
        return primaryKey ? "NVARCHAR(255)" : "NVARCHAR(MAX)";
      case Number:
        return primaryKey ? "INT" : "FLOAT(53)";
      case Boolean:
        return "BIT";
      case Date:
        return "DATETIMEOFFSET(7)";
      default:
        throw new Error("Unable to map value " + value.toString() + " to a SQL type.");
    }
  },
  getPredefinedColumnType: function(value) {
    switch (value) {
      case 'string':
        return 'NVARCHAR(MAX)';
      case 'number':
        return 'FLOAT(53)';
      case 'boolean':
      case 'bool':
        return 'BIT';
      case 'datetime':
      case 'date':
        return 'DATETIMEOFFSET(7)';
    }
    throw new Error('Unrecognised column type: ' + value);
  },
  getPredefinedType: function(value) {
    switch (value) {
      case 'nvarchar':
        return 'string';
      case 'float':
        return 'number';
      case 'bit':
        return 'boolean';
      case 'datetimeoffset':
        return 'datetime';
      case 'timestamp':
        return 'string';
      default:
        return value;
    }
  },
  getSystemPropertiesDDL: function() {
    return {
      version: 'version ROWVERSION NOT NULL',
      createdAt: 'createdAt DATETIMEOFFSET(7) NOT NULL DEFAULT CONVERT(DATETIMEOFFSET(7),SYSUTCDATETIME(),0)',
      updatedAt: 'updatedAt DATETIMEOFFSET(7) NOT NULL DEFAULT CONVERT(DATETIMEOFFSET(7),SYSUTCDATETIME(),0)',
      deleted: 'deleted bit NOT NULL DEFAULT 0'
    };
  },
  getSystemProperties: function() {
    return Object.keys(helpers.getSystemPropertiesDDL());
  },
  isSystemProperty: function(property) {
    return helpers.getSystemProperties().some(function(systemProperty) {
      return property === systemProperty;
    });
  }
};
